---
name: angular-data-integration
description: Angular HttpClient patterns for API integration with Signals. Use when fetching data from REST APIs in Angular, managing async state with Signals, or implementing loading/error state patterns.
---

# Angular Data Integration

Data integration patterns for fetching and synchronizing data in Angular using HttpClient and Signals.

## When to Use

- Fetching data from REST APIs
- Managing application state with Signals
- Implementing loading/error states
- Building data services

## Service Pattern with Signals

```typescript
// services/property.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  status: 'available' | 'under-review' | 'acquired';
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private propertiesSignal = signal<Property[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  properties = this.propertiesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  // Computed values
  availableProperties = computed(() => 
    this.properties().filter(p => p.status === 'available')
  );

  constructor(private http: HttpClient) {}

  loadProperties(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Property[]>('/api/properties')
      .pipe(
        tap(properties => {
          this.propertiesSignal.set(properties);
          this.loadingSignal.set(false);
        }),
        catchError(error => {
          console.error('Failed to load properties', error);
          this.errorSignal.set('Failed to load properties');
          this.loadingSignal.set(false);
          return of([]);
        })
      )
      .subscribe();
  }

  createProperty(property: Omit<Property, 'id'>): Observable<Property> {
    return this.http.post<Property>('/api/properties', property)
      .pipe(
        tap(newProperty => {
          // Update local state optimistically
          this.propertiesSignal.update(props => [...props, newProperty]);
        })
      );
  }

  updateProperty(id: string, updates: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`/api/properties/${id}`, updates)
      .pipe(
        tap(updatedProperty => {
          this.propertiesSignal.update(props =>
            props.map(p => p.id === id ? updatedProperty : p)
          );
        })
      );
  }

  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`/api/properties/${id}`)
      .pipe(
        tap(() => {
          this.propertiesSignal.update(props =>
            props.filter(p => p.id !== id)
          );
        })
      );
  }
}
```

## Component Integration

```typescript
// features/properties/property-list/property-list.component.ts
import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '@/services/property.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-list.component.html',
})
export class PropertyListComponent implements OnInit {
  private propertyService = inject(PropertyService);

  // Expose service signals
  properties = this.propertyService.properties;
  loading = this.propertyService.loading;
  error = this.propertyService.error;

  // Component-specific computed values
  availableCount = computed(() => 
    this.properties().filter(p => p.status === 'available').length
  );

  ngOnInit(): void {
    this.propertyService.loadProperties();
  }

  handleRefresh(): void {
    this.propertyService.loadProperties();
  }
}
```

## Template Pattern

```html
<!-- property-list.component.html -->
<div class="container mx-auto py-8">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">Properties</h1>
    <button 
      data-testid="refresh-button"
      class="btn-primary" 
      (click)="handleRefresh()"
      [disabled]="loading()">
      Refresh
    </button>
  </div>

  @if (loading()) {
    <div class="flex items-center justify-center py-12">
      <app-loading-spinner />
    </div>
  }

  @if (error()) {
    <div class="card bg-red-50 border-red-200 p-4 text-red-800">
      {{ error() }}
    </div>
  }

  @if (!loading() && !error()) {
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (property of properties(); track property.id) {
        <app-property-card [property]="property" />
      }
    </div>

    <p class="mt-4 text-sm text-text-secondary">
      {{ availableCount() }} available properties
    </p>
  }
</div>
```

## HTTP Interceptors

```typescript
// lib/api/http-error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status === 500) {
        console.error('Server error:', error);
      }
      return throwError(() => error);
    })
  );
};
```

## Optimistic Updates

```typescript
updateItem(id: string, updates: Partial<Item>): void {
  // Store original state for rollback
  const originalItems = this.items();
  
  // Optimistically update UI
  this.itemsSignal.update(items =>
    items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  );

  // Send request to server
  this.http.put<Item>(`/api/items/${id}`, updates)
    .pipe(
      tap(updatedItem => {
        // Update with server response
        this.itemsSignal.update(items =>
          items.map(item => item.id === id ? updatedItem : item)
        );
      }),
      catchError(error => {
        // Rollback on error
        this.itemsSignal.set(originalItems);
        console.error('Update failed, rolled back', error);
        return throwError(() => error);
      })
    )
    .subscribe();
}
```

## Pagination Pattern

```typescript
export class PaginatedDataService {
  private currentPageSignal = signal(1);
  private pageSizeSignal = signal(20);
  private dataSignal = signal<any[]>([]);
  private totalPagesSignal = signal(1);

  hasNextPage = computed(() => this.currentPageSignal() < this.totalPagesSignal());
  hasPrevPage = computed(() => this.currentPageSignal() > 1);

  loadPage(page: number): void {
    this.currentPageSignal.set(page);
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', this.pageSizeSignal().toString());

    this.http.get<PaginatedResponse<any>>('/api/data', { params })
      .subscribe({
        next: response => {
          this.dataSignal.set(response.data);
          this.totalPagesSignal.set(response.pagination.totalPages);
        },
        error: error => console.error('Failed to load page', error)
      });
  }
}
```

## File Upload with Progress

```typescript
uploadFile(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  return new Observable(observer => {
    this.http.post('/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percentage = Math.round((100 * event.loaded) / event.total);
          this.uploadProgressSignal.set({
            loaded: event.loaded,
            total: event.total,
            percentage
          });
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgressSignal.set(null);
          observer.next(event.body);
          observer.complete();
        }
      },
      error: (error) => {
        this.uploadProgressSignal.set(null);
        observer.error(error);
      }
    });
  });
}
```

## References

- `references/rxjs-patterns.md` – Advanced RxJS patterns
- `references/error-handling.md` – Comprehensive error handling
