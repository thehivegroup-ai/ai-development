---
name: angular-forms-validation
version: 1.0.0
description: >
  Angular reactive forms with validation and multi-step patterns. Use when building forms in Angular, 
  implementing multi-step wizards, adding real-time validation, or creating complex form layouts with 
  reactive patterns.
  
  Trigger when user mentions: Angular form, reactive form, form validation, FormGroup, FormControl, 
  custom validator, multi-step form, form wizard, real-time validation, or asks about Angular forms 
  best practices.
---

# Angular Forms Validation

Complex form patterns for Angular with real-time validation and multi-step flows.

## When to Use

- Building forms in Angular applications
- Multi-step form workflows
- Forms with real-time calculation/validation
- Complex validation requirements

## Typed Reactive Forms

```typescript
import { NonNullableFormBuilder, FormControl, FormGroup } from '@angular/forms';

interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number>;
}

export class UserFormComponent {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group<UserForm>({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    age: this.fb.control(0, [Validators.required, Validators.min(18)]),
  });
}
```

## Custom Validators

```typescript
// lib/validators/range.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null) return null;
    if (control.value < min) return { min: { min, actual: control.value } };
    if (control.value > max) return { max: { max, actual: control.value } };
    return null;
  };
}

// Usage
pumpCount: this.fb.control(16, [rangeValidator(4, 32)])
```

## Real-Time Updates with Signals

```typescript
export class SiteAttributesComponent {
  // Form controls
  form = this.fb.group({
    pumpCount: this.fb.control(16),
    squareFootage: this.fb.control(5000),
  });

  // Signals for reactive values
  pumpCount = signal(16);
  squareFootage = signal(5000);

  // Computed values
  estimatedCost = computed(() => {
    const baseCost = 2000000;
    const pumpCost = this.pumpCount() * 50000;
    const sqftCost = this.squareFootage() * 200;
    return baseCost + pumpCost + sqftCost;
  });

  ngOnInit(): void {
    // Subscribe to form changes to update signals
    this.form.controls.pumpCount.valueChanges.subscribe(value => {
      this.pumpCount.set(value);
    });

    this.form.controls.squareFootage.valueChanges.subscribe(value => {
      this.squareFootage.set(value);
    });
  }
}
```

## Error Handling Helper

```typescript
getFieldError(fieldName: string): string | null {
  const control = this.form.get(fieldName);
  if (!control || !control.touched || !control.errors) {
    return null;
  }

  const errors = control.errors;
  if (errors['required']) return 'This field is required';
  if (errors['email']) return 'Invalid email format';
  if (errors['min']) return `Minimum value is ${errors['min'].min}`;
  if (errors['max']) return `Maximum value is ${errors['max'].max}`;
  
  return 'Invalid value';
}
```

## Multi-Step Form State

```typescript
// services/form-state.service.ts
import { Injectable, signal } from '@angular/core';

export interface SiteAttributesData {
  targetLocation: string;
  address: string;
  storeStyle: string;
  pumpCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProformaService {
  private siteAttributesSignal = signal<SiteAttributesData | null>(null);
  
  siteAttributes = this.siteAttributesSignal.asReadonly();

  updateSiteAttributes(data: SiteAttributesData): void {
    this.siteAttributesSignal.set(data);
  }
}
```

## Form Submission

```typescript
onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const formData = this.form.getRawValue();
  this.proformaService.updateSiteAttributes(formData);
  this.router.navigate(['/next-step']);
}
```

## Reusable Form Components

```typescript
// components/form-field/form-field.component.ts
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <label class="label">
        {{ label }}
        @if (required) {
          <span class="text-red-600 ml-1">*</span>
        }
      </label>
      <ng-content></ng-content>
      @if (hint && !error) {
        <p class="text-sm text-text-secondary">{{ hint }}</p>
      }
      @if (error) {
        <p class="text-sm text-red-600">{{ error }}</p>
      }
    </div>
  `,
})
export class FormFieldComponent {
  @Input() label!: string;
  @Input() hint?: string;
  @Input() error?: string | null;
  @Input() required = false;
}
```

## Testing Pattern

Add `data-testid` to all form elements:

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()" data-testid="site-attributes-form">
  <app-form-field
    label="Target Location"
    [error]="getFieldError('targetLocation')"
    [required]="true">
    <input
      data-testid="target-location-input"
      type="text"
      formControlName="targetLocation"
      class="input"
    />
  </app-form-field>

  <button
    data-testid="submit-button"
    type="submit"
    class="btn-primary"
    [disabled]="form.invalid">
    Save & Continue
  </button>
</form>
```

## References

- `references/multi-step-forms.md` – Multi-step workflow patterns
- `references/validation-examples.md` – More validator examples
