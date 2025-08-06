# HPE Storage Performance Dashboard - API Documentation

## Overview

This document outlines all the API endpoints and required JSON data structures for the HPE Storage Performance Dashboard application. The dashboard consists of two main pages:

1. **Dashboard Page** - Main overview with multiple tables showing storage devices
2. **System Detail Page** - Detailed view of individual storage systems

## Base Configuration

### API Base URL

```
https://api.hpe-storage.com/v1
```

### Authentication

All API endpoints require Bearer token authentication:

```
Authorization: Bearer <your_api_token>
Content-Type: application/json
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.hpe-storage.com/v1
VITE_API_TOKEN=your_bearer_token_here
VITE_MOCK_MODE=false
```

---

## Dashboard Page APIs

### 1. Storage Devices Overview

**Endpoint:** `GET /storage/devices`

**Description:** Fetches all storage devices for the main dashboard overview table.

**Response Structure:**

```json
{
  "devices": [
    {
      "id": "string|number",
      "name": "string",
      "type": "string",
      "deviceScore": "number (0-100)",
      "score": "number (0-100)",
      "greenScore": "number (0-100)",
      "featureScore": "number (0-100)",
      "capacity": "string",
      "readSpeed": "number (MB/s)",
      "writeSpeed": "number (MB/s)",
      "iops": "number",
      "latency": "number (ms)",
      "throughput": "number (MB/s)",
      "price": "number (USD)",
      "sustainability": {
        "powerEfficiency": "number (0-100)",
        "carbonReduction": "number (0-100)",
        "circularEconomy": "number (0-100)"
      },
      "features": {
        "dataManagement": {
          "deduplication": "string",
          "compression": "string",
          "tiering": "string"
        },
        "security": {
          "encryption": "string",
          "accessControl": ["string"]
        },
        "availability": ["string"],
        "management": ["string"],
        "protocols": ["string"]
      },
      "snapshots": "string",
      "replication": "string",
      "protocols": ["string"]
    }
  ]
}
```

### 2. Sustainability Metrics

**Endpoint:** `GET /sustainability/metrics`

**Description:** Fetches sustainability-focused data for the sustainability table.

**Response Structure:**

```json
{
  "devices": [
    {
      "id": "string|number",
      "name": "string",
      "type": "string",
      "greenScore": "number (0-100)",
      "sustainability": {
        "powerEfficiency": "number (0-100)",
        "carbonReduction": "number (0-100)",
        "circularEconomy": "number (0-100)"
      },
      "capacity": "string",
      "price": "number (USD)"
    }
  ]
}
```

### 3. Performance Metrics

**Endpoint:** `GET /performance/metrics`

**Description:** Fetches performance-focused data for the performance table.

**Response Structure:**

```json
{
  "devices": [
    {
      "id": "string|number",
      "name": "string",
      "type": "string",
      "score": "number (0-100)",
      "readSpeed": "number (MB/s)",
      "writeSpeed": "number (MB/s)",
      "iops": "number",
      "latency": "number (ms)",
      "throughput": "number (MB/s)",
      "capacity": "string"
    }
  ]
}
```

### 4. Feature Comparison

**Endpoint:** `GET /features/comparison`

**Description:** Fetches feature comparison data for the features table.

**Response Structure:**

```json
{
  "devices": [
    {
      "id": "string|number",
      "name": "string",
      "type": "string",
      "featureScore": "number (0-100)",
      "features": {
        "dataManagement": {
          "deduplication": "string",
          "compression": "string",
          "tiering": "string"
        },
        "security": {
          "encryption": "string",
          "accessControl": ["string"]
        },
        "availability": ["string"],
        "management": ["string"],
        "protocols": ["string"]
      },
      "snapshots": "string",
      "replication": "string",
      "protocols": ["string"]
    }
  ]
}
```

---

## System Detail Page APIs

### 1. Individual System Details

**Endpoint:** `GET /storage/devices/{systemId}`

**Description:** Fetches detailed information for a specific storage system.

**URL Parameters:**

- `systemId`: string|number - The unique identifier of the storage system

**Response Structure:**

```json
{
  "device": {
    "id": "string|number",
    "name": "string",
    "type": "string",
    "deviceScore": "number (0-100)",
    "score": "number (0-100)",
    "greenScore": "number (0-100)",
    "featureScore": "number (0-100)",
    "capacity": "string",
    "readSpeed": "number (MB/s)",
    "writeSpeed": "number (MB/s)",
    "iops": "number",
    "latency": "number (ms)",
    "throughput": "number (MB/s)",
    "price": "number (USD)",
    "sustainability": {
      "powerEfficiency": "number (0-100)",
      "carbonReduction": "number (0-100)",
      "circularEconomy": "number (0-100)"
    },
    "features": {
      "dataManagement": {
        "deduplication": "string",
        "compression": "string",
        "tiering": "string"
      },
      "security": {
        "encryption": "string",
        "accessControl": ["string"]
      },
      "availability": ["string"],
      "management": ["string"],
      "protocols": ["string"]
    },
    "snapshots": "string",
    "replication": "string",
    "protocols": ["string"]
  }
}
```

---

## Data Type Specifications

### Required Field Types

| Field          | Type           | Description                        | Range/Format                           |
| -------------- | -------------- | ---------------------------------- | -------------------------------------- |
| `id`           | string\|number | Unique identifier                  | Any format (e.g., 1, "HPE-SSD-001")    |
| `name`         | string         | Device/System name                 | Any string                             |
| `type`         | string         | Storage type                       | e.g., "HPE GreenLake For File Storage" |
| `deviceScore`  | number         | Overall device score               | 0-100                                  |
| `score`        | number         | Performance score                  | 0-100                                  |
| `greenScore`   | number         | Sustainability score               | 0-100                                  |
| `featureScore` | number         | Feature completeness score         | 0-100                                  |
| `capacity`     | string         | Storage capacity                   | e.g., "100TB", "2.5TB"                 |
| `readSpeed`    | number         | Read speed in MB/s                 | Positive number                        |
| `writeSpeed`   | number         | Write speed in MB/s                | Positive number                        |
| `iops`         | number         | Input/Output operations per second | Positive number                        |
| `latency`      | number         | Access latency in milliseconds     | Positive decimal                       |
| `throughput`   | number         | Data throughput in MB/s            | Positive number                        |
| `price`        | number         | Price in USD                       | Positive number                        |

### Sustainability Object

```json
{
  "powerEfficiency": "number (0-100)",
  "carbonReduction": "number (0-100)",
  "circularEconomy": "number (0-100)"
}
```

### Features Object

```json
{
  "dataManagement": {
    "deduplication": "string (e.g., 'Advanced', 'Standard', 'None')",
    "compression": "string (e.g., 'Advanced', 'Standard', 'None')",
    "tiering": "string (e.g., 'Automated', 'Manual', 'None')"
  },
  "security": {
    "encryption": "string (e.g., 'AES-256', 'AES-128')",
    "accessControl": ["array of strings (e.g., 'RBAC', 'MFA')"]
  },
  "availability": [
    "array of strings (e.g., 'Auto-failover', 'Hot-spare', 'RAID')"
  ],
  "management": ["array of strings (e.g., 'REST API', 'Cloud Integration')"],
  "protocols": ["array of strings (e.g., 'NFS', 'SMB', 'iSCSI')"]
}
```

---

## Example API Responses

### Example Device Record

```json
{
  "id": 1,
  "name": "BLR-CZ234402KF",
  "type": "HPE GreenLake For File Storage",
  "deviceScore": 98,
  "score": 99,
  "greenScore": 98,
  "featureScore": 97,
  "capacity": "100TB",
  "readSpeed": 3500,
  "writeSpeed": 3200,
  "iops": 120000,
  "latency": 0.1,
  "throughput": 6800,
  "price": 45000,
  "sustainability": {
    "powerEfficiency": 92,
    "carbonReduction": 78,
    "circularEconomy": 85
  },
  "features": {
    "dataManagement": {
      "deduplication": "Advanced",
      "compression": "Advanced",
      "tiering": "Automated"
    },
    "security": {
      "encryption": "AES-256",
      "accessControl": ["RBAC", "MFA"]
    },
    "availability": ["Auto-failover", "Hot-spare", "RAID"],
    "management": ["REST API", "Cloud Integration", "AI Analytics"],
    "protocols": ["NFS", "SMB", "REST API"]
  },
  "snapshots": "Yes",
  "replication": "Yes",
  "protocols": ["NFS", "SMB", "REST API"]
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "string (optional)"
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Implementation Notes

1. **Fallback Behavior**: The application falls back to mock data if API calls fail
2. **ID Flexibility**: System IDs can be either strings or numbers
3. **Required Fields**: All fields in the examples above are expected by the UI
4. **Score Ranges**: All score fields should be numbers between 0-100
5. **Array Fields**: Protocol and feature arrays can be empty but should be present
6. **Null Handling**: The application handles missing optional fields gracefully

---

## Mock Data Mode

For development, set `VITE_MOCK_MODE=true` to use built-in mock data instead of API calls. The mock data structure matches the API response format exactly.

## Support

For API questions or issues, contact the HPE Storage API team or refer to the main project documentation.
