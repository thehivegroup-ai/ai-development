# Web Untitled UI Build Form

Build a form using Untitled UI form components with proper validation and accessibility.

## Steps

1. **Define form requirements** - Fields, validation rules, submit behavior
2. **Identify form components needed** - Input, Select, Checkbox, Button, etc.
3. **Install required components** - Use MCP or CLI to add components
4. **Implement form structure** - Layout with proper labels and validation
5. **Add state management** - Form state, validation, submission handling
6. **Test form behavior** - Validation, error states, accessibility

## Form Components

### Basic Input Fields
```typescript
import { Input } from "@/components/base/input/input";

<Input
  label="Email"
  type="email"
  placeholder="olivia@untitledui.com"
  isRequired
  isInvalid={errors.email}
  hint={errors.email || "We'll never share your email"}
/>
```

### Select Dropdowns
```typescript
import { Select } from "@/components/base/select/select";

<Select label="Country" placeholder="Select country" items={countries}>
  {(item) => <Select.Item id={item.code}>{item.name}</Select.Item>}
</Select>
```

### Checkboxes and Radios
```typescript
import { Checkbox } from "@/components/base/checkbox/checkbox";

<Checkbox
  label="Accept terms and conditions"
  isRequired
  hint="You must accept to continue"
/>
```

### Submit Button
```typescript
import { Button } from "@/components/base/buttons/button";

<Button
  type="submit"
  color="primary"
  isLoading={isSubmitting}
  showTextWhileLoading
>
  Submit
</Button>
```

## Form Pattern Example

```typescript
import { useState } from "react";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Button } from "@/components/base/buttons/button";

interface FormData {
  email: string;
  country: string;
  acceptTerms: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    country: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Partial<FormData> = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept terms";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit
    setIsSubmitting(true);
    try {
      await submitForm(formData);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        isRequired
        isInvalid={!!errors.email}
        hint={errors.email}
      />
      
      <Select
        label="Country"
        items={countries}
        selectedKey={formData.country}
        onSelectionChange={(key) => 
          setFormData({ ...formData, country: String(key) })
        }
      >
        {(item) => <Select.Item id={item.code}>{item.name}</Select.Item>}
      </Select>
      
      <Checkbox
        label="Accept terms and conditions"
        isSelected={formData.acceptTerms}
        onChange={setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
        isInvalid={!!errors.acceptTerms}
      />
      
      <Button type="submit" isLoading={isSubmitting} showTextWhileLoading>
        Submit
      </Button>
    </form>
  );
}
```

## Validation Patterns

### Client-Side Validation
- Validate on blur for immediate feedback
- Show errors inline below each field
- Use `isInvalid` prop to trigger error styling
- Display validation hint text

### Server-Side Validation
- Handle API errors gracefully
- Map API errors to form fields
- Show general errors in a toast or alert
- Maintain form state on error

## Accessibility Requirements

1. **Labels** - Every input must have a label
2. **Error messages** - Use `hint` prop with `isInvalid`
3. **Required fields** - Use `isRequired` prop
4. **Focus management** - Focus first error on validation
5. **Keyboard navigation** - All inputs must be keyboard accessible

## Form Layout

### Vertical Forms (Recommended)
```typescript
<form className="flex flex-col gap-lg max-w-md">
  {/* Fields stacked vertically */}
</form>
```

### Two-Column Forms
```typescript
<form className="grid grid-cols-2 gap-lg">
  {/* Fields in two columns */}
</form>
```

### Field Groups
```typescript
<div className="flex flex-col gap-md">
  <h3 className="text-secondary">Personal Information</h3>
  <Input label="First Name" />
  <Input label="Last Name" />
</div>
```

## Common Components Needed

Install these components for most forms:
```bash
npx untitledui@latest add input select checkbox button --yes
```

For advanced forms, also add:
```bash
npx untitledui@latest add textarea date-picker file-uploader toggle --yes
```

## Guidance

- **Read agent-guide.md** - Check Input, Select, Checkbox sections for props
- **Use semantic colors** - `text-error-primary` for errors, not `text-red-600`
- **Apply proper spacing** - Use `gap-lg` between fields, `gap-xl` between sections
- **Include all states** - Empty, filled, error, disabled, loading
- **Test validation** - Both client and server-side error handling
