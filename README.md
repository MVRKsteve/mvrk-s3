# MVRK AWS S3 Helper Service

This service is meant to expose some simplified logic for storing to and retrieving from AWS S3 buckets.

## Available Methods:
### **Store**
  
| Param | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| filesToStore | Array/Object | **True** | File object(s) to be stored |
  
### **Get**
| Param | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| filePath | String | **True** | File path(s) to be retrieved |
  
### **GetAll**
| Param | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| directory | String | **False** | Specific directory to search within the bucket - Defaults to root directory |
