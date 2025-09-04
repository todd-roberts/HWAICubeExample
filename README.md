# HW Basic AI Example with State Machine

This code includes example StateMachine and State classes and a small demo of an "EnemyCube" that pursues the first player it finds in its detection range.

To test it out, drop the `StateMachine.ts`, `EnemyCube.ts`, and `EnemyCubeStates.ts` scripts into your world's scripts and assign `EnemyCube` to an entity.

Note: This uses a NavMeshAgent, so make sure to add a navigation volume and a navigation profile to your world, and assign the profile to your entity.