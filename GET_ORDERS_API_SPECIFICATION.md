# Get Orders API Specification

## Endpoint
```
GET /orders
```

## Request Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of orders per page (max: 100) |
| `status` | string | No | - | Filter by order status |
| `search` | string | No | - | Search in order details, tracking number, or customer names |

### Status Filter Options
- `pending` - Orders awaiting confirmation
- `confirmed` - Orders confirmed and ready for pickup
- `in_transit` - Orders currently in transit
- `delivered` - Orders that have been delivered
- `cancelled` - Cancelled orders

## Example Requests

### Get all orders (first page)
```
GET /orders
```

### Get orders with pagination
```
GET /orders?page=2&limit=20
```

### Get orders by status
```
GET /orders?status=in_transit
```

### Search orders
```
GET /orders?search=electronics
```

### Combined filters
```
GET /orders?page=1&limit=10&status=delivered&search=john
```

## Response Structure

### Success Response (200 OK)
```json
{
  "orders": [
    {
      "id": "string - unique order identifier",
      "trackingNumber": "string - tracking number",
      "status": "string - order status",
      "sender": {
        "name": "string",
        "phone": "string",
        "email": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string"
      },
      "receiver": {
        "name": "string",
        "phone": "string",
        "email": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string"
      },
      "package": {
        "type": "string - package type",
        "weight": "number - weight in kg",
        "dimensions": {
          "length": "number - length in cm",
          "width": "number - width in cm",
          "height": "number - height in cm"
        },
        "value": "number - declared value in USD",
        "description": "string - package description"
      },
      "shipping": {
        "serviceType": "string - service type",
        "deliveryDate": "string - ISO date string",
        "specialInstructions": "string - special instructions"
      },
      "createdAt": "string - ISO date string",
      "updatedAt": "string - ISO date string",
      "estimatedDelivery": "string - ISO date string",
      "actualDelivery": "string - ISO date string (if delivered)",
      "totalCost": "number - total cost in USD",
      "notes": "string - additional notes"
    }
  ],
  "total": "number - total number of orders",
  "page": "number - current page number",
  "limit": "number - orders per page"
}
```

## Example Response

```json
{
  "orders": [
    {
      "id": "ORD-2024-001234",
      "trackingNumber": "SS123456789",
      "status": "in_transit",
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
      },
      "createdAt": "2024-01-10T10:30:00Z",
      "updatedAt": "2024-01-12T14:20:00Z",
      "estimatedDelivery": "2024-01-15T18:00:00Z",
      "totalCost": 25.99,
      "notes": "Customer requested morning delivery"
    },
    {
      "id": "ORD-2024-001235",
      "trackingNumber": "SS123456790",
      "status": "delivered",
      "sender": {
        "name": "Mike Johnson",
        "phone": "+1555123456",
        "email": "mike.johnson@email.com",
        "address": "789 Pine Street",
        "city": "Chicago",
        "state": "IL",
        "zip": "60601"
      },
      "receiver": {
        "name": "Sarah Wilson",
        "phone": "+1555987654",
        "email": "sarah.wilson@email.com",
        "address": "321 Elm Avenue",
        "city": "Miami",
        "state": "FL",
        "zip": "33101"
      },
      "package": {
        "type": "document",
        "weight": 0.5,
        "dimensions": {
          "length": 25,
          "width": 15,
          "height": 2
        },
        "value": 50.00,
        "description": "Legal documents"
      },
      "shipping": {
        "serviceType": "overnight",
        "deliveryDate": "2024-01-08",
        "specialInstructions": "Signature required"
      },
      "createdAt": "2024-01-07T09:15:00Z",
      "updatedAt": "2024-01-08T16:45:00Z",
      "estimatedDelivery": "2024-01-08T17:00:00Z",
      "actualDelivery": "2024-01-08T15:30:00Z",
      "totalCost": 45.99,
      "notes": "Delivered successfully"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid query parameters",
  "details": {
    "page": "Page must be a positive integer",
    "limit": "Limit must be between 1 and 100"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An error occurred while fetching orders"
}
```

## Additional Endpoints

### Get Single Order
```
GET /orders/{orderId}
```

### Get Order Tracking
```
GET /orders/{orderId}/tracking
```

## Implementation Notes

### Authentication
- User must be authenticated with valid JWT token
- Only returns orders belonging to the authenticated user
- Admin users may have access to all orders (based on role)

### Pagination
- Default page size: 10 orders
- Maximum page size: 100 orders
- Use cursor-based pagination for better performance with large datasets

### Filtering
- Status filter supports multiple values: `?status=pending,confirmed`
- Search functionality should search across:
  - Order ID
  - Tracking number
  - Sender/receiver names
  - Package description

### Sorting
- Default sort: Most recent orders first (createdAt DESC)
- Additional sorting options:
  - `sort=createdAt` - Sort by creation date
  - `sort=status` - Sort by status
  - `sort=trackingNumber` - Sort by tracking number
  - `order=asc|desc` - Sort order (default: desc)

### Performance Considerations
- Implement database indexing on frequently queried fields
- Use pagination to limit response size
- Consider caching for frequently accessed data
- Implement rate limiting to prevent abuse

### Security
- Validate all query parameters
- Sanitize search input to prevent injection attacks
- Implement proper access controls
- Log all API access for audit purposes
