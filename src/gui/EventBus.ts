type EventListener = (data?: any) => void;

export class EventBus {
  private static listeners: Map<string, EventListener[]> = new Map();

  /**
   * Subscribes to a specific event, allowing a listener to be invoked
   * whenever the event is emitted.
   * @param event The name of the event to subscribe to.
   * @param listener The listener to invoke when the event is emitted.
   */
  public static subscribe(event: string, listener: EventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }

  /**
   * Removes a listener from the list of listeners for a given event.
   * The listener will no longer be invoked when the event is emitted.
   * @param event The name of the event that the listener was subscribed to.
   * @param listener The listener to remove.
   */
  public static unsubscribe(event: string, listener: EventListener): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      this.listeners.set(
        event,
        listeners.filter((l) => l !== listener)
      );
    }
  }

  /**
   * Emits an event to all listeners subscribed to the given event.
   * @param event The name of the event to emit.
   * @param data Optional data to pass to the listeners.
   */
  public static emit(event: string, data?: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
}
