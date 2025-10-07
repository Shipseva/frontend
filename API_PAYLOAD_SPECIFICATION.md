# Order Creation API Payload Specification

## Endpoint
```
POST /orders
```

## Request Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## Request Payload Structure

```json
{
  "sender": {
    "name": "string (required)",
    "phone": "string (required)",
    "email": "string (optional)",
    "address": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "zip": "string (required)"
  },
  "receiver": {
    "name": "string (required)",
    "phone": "string (required)",
    "email": "string (optional)",
    "address": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "zip": "string (required)"
  },
  "package": {
    "type": "string (required) - enum: document, parcel, fragile, electronics, clothing, other",
    "weight": "number (required) - in kg, min: 0.1",
    "dimensions": {
      "length": "number (required) - in cm, min: 1",
      "width": "number (required) - in cm, min: 1",
      "height": "number (required) - in cm, min: 1"
    },
    "value": "number (optional) - declared value in USD",
    "description": "string (optional) - package contents description"
  },
  "shipping": {
    "serviceType": "string (required) - enum: standard, express, overnight, economy",
    "deliveryDate": "string (optional) - ISO date string (YYYY-MM-DD)",
    "specialInstructions": "string (optional) - special handling instructions"
  }
}
```

## Example Request Payload

```json
{
  "sender": {
    "name": "John Smith",
    "phone": "+1234567890",
    "email": "john.smith@email.com",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "receiver": {
    "name": "Jane Doe",
    "phone": "+1987654321",
    "email": "jane.doe@email.com",
    "address": "456 Oak Avenue",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90210"
  },
  "package": {
    "type": "parcel",
    "weight": 2.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "value": 150.00,
    "description": "Electronics and accessories"
  },
  "shipping": {
    "serviceType": "express",
    "deliveryDate": "2024-01-15",
    "specialInstructions": "Handle with care - fragile items inside"
  }
}
```

## Response Structure

### Success Response (201 Created)
```json
{
  "orderId": "string - unique order identifier",
  "trackingNumber": "string - tracking number for shipment",
  "status": "string - enum: pending, confirmed, in_transit, delivered, cancelled",
  "estimatedDelivery": "string - ISO date string",
  "totalCost": "number - total shipping cost in USD",
  "message": "string - success message"
}
```

### Example Success Response
```json
{
  "orderId": "ORD-2024-001234",
  "trackingNumber": "SS123456789",
  "status": "pending",
  "estimatedDelivery": "2024-01-15T18:00:00Z",
  "totalCost": 25.99,
  "message": "Order created successfully"
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "string - error message",
  "details": "object - validation errors (optional)"
}
```

### Example Error Response
```json
{
  "error": "Validation failed",
  "details": {
    "sender.name": "Name is required",
    "package.weight": "Weight must be at least 0.1 kg"
  }
}
```

## Validation Rules

### Required Fields
- `sender.name`, `sender.phone`, `sender.address`, `sender.city`, `sender.state`, `sender.zip`
- `receiver.name`, `receiver.phone`, `receiver.address`, `receiver.city`, `receiver.state`, `receiver.zip`
- `package.type`, `package.weight`, `package.dimensions.length`, `package.dimensions.width`, `package.dimensions.height`
- `shipping.serviceType`

### Field Validation
- **Phone numbers**: Should be in international format (+1234567890)
- **Email**: Valid email format (optional fields)
- **Weight**: Minimum 0.1 kg, maximum based on service type
- **Dimensions**: Minimum 1 cm for each dimension
- **Package type**: Must be one of the enum values
- **Service type**: Must be one of the enum values
- **Dates**: ISO format (YYYY-MM-DD) for deliveryDate

### Business Rules
1. **Weight limits**: Different service types may have different weight limits
2. **Dimension limits**: Maximum dimensions may vary by service type
3. **Delivery date**: Should be in the future and within service type capabilities
4. **Address validation**: ZIP codes should be valid for the given state/city

## Additional Considerations

### Authentication
- User must be authenticated (JWT token required)
- Order is associated with the authenticated user

### Rate Calculation
- The API should calculate shipping costs based on:
  - Package weight and dimensions
  - Service type selected
  - Distance between sender and receiver
  - Any special handling requirements

### Tracking
- Generate unique tracking number upon order creation
- Set initial status to "pending"
- Provide estimated delivery date based on service type and distance

### Notifications
- Send confirmation email to sender
- Send tracking information to both sender and receiver (if emails provided)

## Database Schema Considerations

### Orders Table
- `id` (Primary Key)
- `user_id` (Foreign Key to users table)
- `tracking_number` (Unique)
- `status`
- `sender_data` (JSON)
- `receiver_data` (JSON)
- `package_data` (JSON)
- `shipping_options` (JSON)
- `total_cost`
- `estimated_delivery`
- `created_at`
- `updated_at`

### Status Workflow
1. `pending` - Order created, awaiting confirmation
2. `confirmed` - Order confirmed, ready for pickup
3. `in_transit` - Package is in transit
4. `delivered` - Package delivered successfully
5. `cancelled` - Order cancelled
