## Arkitektur

```mermaid
flowchart LR
    Client[Client] --> Routes[srcController.js]
    Routes --> Controller[srcController.js]
    Controller --> Service[srcService.js]
    Service --> Archive[(Archive)]
```
