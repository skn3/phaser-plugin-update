import Phaser from 'phaser';

export default class UpdatePlugin extends Phaser.Plugins.ScenePlugin {
  boot () {
    const events = this.systems.events;

    this.gameObjects = new Phaser.Structs.Set();

    events.on('update', this.sceneUpdate, this);
    events.on('shutdown', this.sceneShutdown, this);
    events.once('destroy', this.sceneDestroy, this);
  }

  sceneUpdate (time, delta) {
    this.gameObjects.each(function (obj) {
      obj.update(time, delta);
    });
  }

  sceneShutdown () {
    this.gameObjects.clear();
  }

  sceneDestroy () {
    const events = this.systems.events;

    events.off('update', this.sceneUpdate, this);
    events.off('shutdown', this.sceneShutdown, this);
    events.off('destroy', this.sceneDestroy, this);

    this.gameObjects = null;
    this.scene = null;
    this.systems = null;
  }

  add (obj) {
    obj.once('destroy', this.remove, this);
    this.gameObjects.set(obj);
    return obj;
  }

  addMultiple (objs) {
    objs.forEach(this.add, this);
    return objs;
  }

  remove (obj) {
    obj.off('destroy', this.remove, this);
    this.gameObjects.delete(obj);
    return obj;
  }

  dump () {
    // console.log('gameObjects', this.gameObjects.getArray());
    console.log('gameObjects: %s', this.gameObjects.size);
  }
}

if (typeof window !== 'undefined') {
  window.PhaserUpdatePlugin = UpdatePlugin;
}
