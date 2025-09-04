import * as hz from "horizon/core";

export type EntityCollision = {
  entity: hz.Entity;
  at: hz.Vec3;
  normal: hz.Vec3;
  velocity: hz.Vec3;
  localColliderName: string;
  otherColliderName: string;
};

export type PlayerCollision = {
  player: hz.Player;
  at: hz.Vec3;
  normal: hz.Vec3;
  velocity: hz.Vec3;
  localColliderName: string;
  otherColliderName: string;
};

export abstract class State<
  TComponent extends hz.Component,
  TName extends string = string
> {
  protected abstract _name: TName;
  protected _component: TComponent;

  constructor(component?: hz.Component) {
    this._component = component as TComponent;
  }

  public getName(): TName {
    return this._name;
  }

  public setComponent(component: TComponent) {
    this._component = component;
  }

  public abstract enter(): void;

  public update(deltaTime: number): void {}

  public prePhysicsUpdate(deltaTime: number) {}

  public handleEntityCollision(collision: EntityCollision) {}

  public handlePlayerCollision(collision: PlayerCollision) {}

  public abstract exit(): void;
}

export class StateMachine<TComponent extends hz.Component> {
  private readonly _component: TComponent;
  private _currentState?: State<TComponent> | null;

  constructor(component: TComponent) {
    this._component = component;
  }

  public getState() {
    return this._currentState;
  }

  public setState(newState: State<TComponent> | null): void {
    this._currentState?.exit();

    this._currentState = newState;
    this._currentState?.setComponent(this._component);

    this._currentState?.enter();
  }

  public clearState(): void {
    this._currentState?.exit();
    this._currentState = null;
  }

  public update(deltaTime: number) {
    this._currentState?.update(deltaTime);
  }

  public prePhysicsUpdate(deltaTime: number) {
    this._currentState?.prePhysicsUpdate(deltaTime);
  }

  public handleEntityCollision = (entityCollision: EntityCollision) => {
    this._currentState?.handleEntityCollision(entityCollision);
  };

  public handlePlayerCollision = (playerCollision: PlayerCollision) => {
    this._currentState?.handlePlayerCollision(playerCollision);
  };
}
