Notes:
1. Naming is just a tentative proposal.
2. It's very evolutionary.

# Objects in system

## User roles
- owner - user who created **sourceDevice**
- viewer - user who can browse and be informed about **incidents** on **sourceDevice**. Every **owner** is always also **viewer** of all his devices. Viewer can use different **browsingEnvironment** to browse **viewingDevice**

## Device types
- sourceDevice
- viewingDevice
Both refer to the same **device** but differ in responsiblities

## Other
- browsingEnvironment - each unique place where user can browse **viewingDevice**. E.g. Chrome on laptop, FF on laptop, mobile, tablet..
- localMediaStream
- server
- detector
- incident
- pushNotification
- FCMRegistrationToken - identifies **viewer** who can receive notification on each **browsingEnviroment** where he had subscribed to **pushNotifications**
- FCMTopic - one topic is associated with on **sourceDevice**
- RTCConnection

# Use cases

## Owner
- create device
- open **sourceDevice** and browse its details
- remove device
- configure device - adjust **detectors**, select tracked **localMediaStream** area
    - on the **sourceDevice**
    - on the **viewingDevice** // ? Keeping conf only on owner might simplify access perm, then on **viewingDevice** you could only subscribe/unsubscribe to notifications
- share device for **viewers**
    - in the phase1 by long, resonably secure link that can be invalidated
    - in the phase2 by individual permission system

## Viewer
- enable/disable **pushNotifications** for Watchdog
    - // For the case of refreshing of token, we can keep in localStorage user's **FCMTopics** subscription's state and reinitialize new tokens
- see list of available **viewingDevices**
- open **viewingDevice** and browse **localMediaStream**, **incidents**
- subscribe/unsubscribe to **FCMTopic** connected with **viewingDevice**
- receive pushNotifications about **incidents** on tracked **viewingDevice**

# Operations

## sourceDevice
- connect to **localMediaStream**
- tracking **localMediaStream** using **detectors** and saving **indcidents** if something was detected
- enable connecting to it via **RTCConnection**

## viewingDevice
- connect to **sourceDevice**'s **localMediaStream** via **RTCConnection**
- display recent **incidents**

## server
- save/remove **viewer**'s **FCMRegistrationToken**
- subscribe/unsubscribe to **FCMTopic** (only allow **viewer**)
- on new **incident** send **pushNotification** to **viewers** subscribed to related **FCMTopic**
