# ENROLLMENT AUDIT
Owner: Kaushalendra Yadav

## Workflow Trace
POST /users takes a JSON user_id and 
ame (ackend/app/main.py:350-352), checks if they exist (ackend/app/main.py:353-356), and saves the User object (ackend/app/main.py:357-359).

## Captured vs. Not Captured
Enrollment captures only basic strings. It does NOT capture or store credentials or biometrics (Face or RFID mapping).

## Device Push & "Enroll Once"
Device push is ABSENT (ackend/app/main.py:349-359). The concept of "enroll once, works everywhere" is BROKEN today since no data is sent to the devices. Users must be manually enrolled on each physical device.

## Status
PARTIAL. The API endpoint exists, but biometrics and hardware push are totally absent.
