# CAPACITY AUDIT
Owner: Kaushalendra Yadav

## Storage Capacity
There are no hardcoded row limits or ceilings on user count in the database schema (ackend/app/models.py) or enrollment endpoint (ackend/app/main.py:349-359). The backend database will easily accept the 2,501st user.

## Display Limits
API pagination caps data returns (e.g., 10 items in GET /events ackend/app/main.py:142, 10 items in GET /users/search ackend/app/main.py:364, 20 items in GET /alerts ackend/app/main.py:312). These are purely display limits, NOT data or storage limits.

## Device-Sync Capacity 
Device synchronization capacity is fundamentally broken. Users are manually mapped via a hardcoded dictionary (ackend/app/background.py:17-21), meaning the 2,501st user would be completely ignored by the devices. The failure point for the 2,501st user is the synchronization layer to the hardware devices.
