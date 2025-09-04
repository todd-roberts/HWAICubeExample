import { EnemyCube } from "./EnemyCube";
import { State } from "./StateMachine";

export class EnemyCubeIdleState extends State<EnemyCube> {
  protected _name = "EnemyCubeIdle";

  public enter() {
    this._component.getNavMeshAgent().isImmobile.set(true);
  }

  public update(_deltaTime: number) {
    const players = this._component.world.getPlayers();
    const currentPosition = this._component.entity.position.get();
    const detectionRange = this._component.getDetectionRange();

    // Finds the first player in range
    const playerInRange = players.find((player) => {
      player.position.get().distance(currentPosition) <= detectionRange;
    });

    console.log({
      playerInRange: playerInRange ? playerInRange.name.get() : null,
    });

    if (playerInRange) {
      this._component.setTargetPlayer(playerInRange);
      this._component.setState(new EnemyCubeChasePlayerState());
    }
  }

  public exit() {}
}

export class EnemyCubeChasePlayerState extends State<EnemyCube> {
  protected _name = "EnemyCubeChasePlayer";

  public enter() {
    const navMeshAgent = this._component.getNavMeshAgent();

    navMeshAgent.isImmobile.set(false);

    const targetPlayer = this._component.getTargetPlayer();

    if (targetPlayer) {
      navMeshAgent.destination.set(targetPlayer.position.get());
    } else {
      this._component.setState(new EnemyCubeIdleState());
    }
  }

  public update(_deltaTime: number) {
    const targetPlayer = this._component.getTargetPlayer();

    if (!targetPlayer) {
      this._component.setState(new EnemyCubeIdleState());
      return;
    }

    const currentPosition = this._component.entity.position.get();
    const distanceToTarget = targetPlayer.position
      .get()
      .distance(currentPosition);

    if (distanceToTarget > this._component.getDetectionRange()) {
      this._component.setTargetPlayer(null);
      this._component.setState(new EnemyCubeIdleState());
    }
  }

  public exit() {}
}
