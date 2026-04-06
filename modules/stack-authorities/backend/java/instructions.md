# Java Backend Standards

**Platform-Agnostic Instructions**

This module provides Java backend development standards for REST APIs using Spring Boot.

---

## Architecture

### Layered Structure

**Controller → Service → Repository pattern:**

```java
// Controller: HTTP boundary only
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        User user = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(user));
    }
}

// Service: Business logic
@Service
public class UserService {
    private final UserRepository repository;
    
    @Transactional
    public User create(UserRequest request) {
        // Business logic, validation, orchestration
        return repository.save(new User(request.getEmail(), request.getName()));
    }
}

// Repository: Data access
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

## Validation

**Validate at boundaries using Bean Validation:**

```java
public class UserRequest {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;
    
    @Min(18)
    private Integer age;
}
```

## Error Handling

**Use `@ControllerAdvice` for consistent error responses:**

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage
            ));
        return ResponseEntity
            .badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", "Invalid input", errors));
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage(), null));
    }
}
```

## Status Codes

- `200` – Success with body
- `201` – Created
- `204` – Success, no body
- `400` – Bad request (validation failure)
- `401` – Unauthorized
- `403` – Forbidden
- `404` – Not found
- `409` – Conflict
- `500` – Server error

## Testing

**Service layer tests:**

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository repository;
    
    @InjectMocks
    private UserService service;
    
    @Test
    void create_ValidUser_ReturnsUser() {
        UserRequest request = new UserRequest("test@example.com", "Test User");
        User expected = new User(1L, request.getEmail(), request.getName());
        
        when(repository.save(any(User.class))).thenReturn(expected);
        
        User result = service.create(request);
        
        assertThat(result.getEmail()).isEqualTo(request.getEmail());
        verify(repository).save(any(User.class));
    }
}
```

**Integration tests:**

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void createUser_ValidRequest_Returns201() {
        UserRequest request = new UserRequest("test@example.com", "Test User");
        
        ResponseEntity<UserResponse> response = restTemplate.postForEntity(
            "/api/users", 
            request, 
            UserResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getEmail()).isEqualTo(request.getEmail());
    }
}
```
