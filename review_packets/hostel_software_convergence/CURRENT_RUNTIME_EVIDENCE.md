# CURRENT RUNTIME EVIDENCE
Owner: Shivam Pal

## 1. Cloud vs Edge Contradiction
Cloud deployment prevents direct GPIO manipulation (Raspberry Pi Edge logic), meaning if it runs on Render, the hardware interaction logic silently goes into mock mode. Currently no physical evidence proves live Edge deployment.

## 2. Validation Required
Production environment requires human execution of Linux/Pi commands:
- uname -a, whoami, systemctl list-unit-files | grep -i hias, ip addr, ps aux | grep uvicorn.
To establish reality, the commands must be run on the target hardware.
