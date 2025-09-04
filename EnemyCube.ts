import * as hz from "horizon/core";

import { State, StateMachine } from "./StateMachine";

import { EnemyCubeIdleState } from "./EnemyCubeStates";
import { NavMeshAgent } from "horizon/navmesh";

export class EnemyCube extends hz.Component<typeof EnemyCube> {
  static propsDefinition = {
    detectionRange: { type: hz.PropTypes.Number, default: 10 },
  };

  private _targetPlayer: hz.Player | null = null;

  private _stateMachine = new StateMachine<EnemyCube>(this);

  preStart() {
    this.connectLocalBroadcastEvent(
      hz.World.onUpdate,
      (update: { deltaTime: number }) => {
        this._stateMachine.update(update.deltaTime);
      }
    );
  }

  start() {
    this._stateMachine.setState(new EnemyCubeIdleState());
  }

  public setState(state: State<EnemyCube>) {
    this._stateMachine.setState(state);
  }

  public getNavMeshAgent() {
    return this.entity.as(NavMeshAgent);
  }

  public getDetectionRange() {
    return this.props.detectionRange;
  }

  public getTargetPlayer() {
    return this._targetPlayer;
  }

  public setTargetPlayer(player: hz.Player | null) {
    this._targetPlayer = player;
  }
}

hz.Component.register(EnemyCube);
