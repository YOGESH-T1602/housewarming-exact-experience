REVISED HOUSEWARMING INVITATION — SINGLE INVITATION REVEAL

This revision removes the extra envelope/letter scene entirely.

VISITOR FLOW
1. Start at the closed carved temple doors.
2. Tap OPEN THE DOORS.
3. The two door panels rotate open. At the same time, the ACTUAL Tamil invitation artwork emerges from the doorway, moves towards the viewer, and settles upright.
4. Tap the floating invitation to expand into the full-size actual invitation.
5. Tap CONTINUE to see the kuthuvilakku thank-you scene.
6. Tap REPLAY INVITATION to restart.

IMPORTANT FIXES
- There is only one invitation: assets/actual-invitation.jpg.
- The separate envelope/reference-letter scene has been removed.
- The invitation is never rotated upside down; it stays at 0-degree rotation and uses object-fit: contain.
- The actual invitation is shown in its original portrait proportions.
- Door opening and invitation emergence are timed as one continuous transition.
- The thank-you image is displayed in its natural proportions with the message beneath it.

RUN
Extract the ZIP, open the folder in VS Code, and run index.html using Live Server.
Keep internet access enabled for Three.js and Google Fonts.
If the Three.js CDN is unavailable, CSS hinged-door animation is used as a fallback.
