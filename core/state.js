/* =================================================================
   STATE.JS — Centralized Application State
   Subscribable store. UI components listen to state changes.
   ================================================================= */

const AppState = {
  _data: {
    user: null,
    overview: null,
    languages: [],
    recentActivity: [],
    insights: null,
    notifications: { count: 0, items: [] },
    ui: {
      sidebarOpen: false,
      activeTab: 'dashboard',
      loading: false,
      error: null,
      mobileMenuOpen: false,
    }
  },

  _listeners: {},

  get(key) {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, this._data);
  },

  set(key, value) {
    const keys = key.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, k) => {
      if (!obj[k]) obj[k] = {};
      return obj[k];
    }, this._data);

    const oldValue = target[last];
    target[last] = value;
    this._notify(key, value, oldValue);
    if (keys.length > 0) this._notify(keys.join('.'), target, target);
  },

  merge(key, partial) {
    const current = this.get(key) || {};
    if (typeof current !== 'object' || Array.isArray(current)) {
      throw new Error(`Cannot merge into non-object state at "${key}"`);
    }
    this.set(key, { ...current, ...partial });
  },

  subscribe(key, callback) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(callback);
    callback(this.get(key));
    return () => {
      this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
    };
  },

  once(key, callback) {
    const unsub = this.subscribe(key, (value) => {
      unsub();
      callback(value);
    });
  },

  _notify(key, newValue, oldValue) {
    const cbs = this._listeners[key];
    if (cbs) {
      cbs.forEach(cb => {
        try { cb(newValue, oldValue); } catch (err) {
          console.error(`State listener error for "${key}":`, err);
        }
      });
    }
  },

  reset() {
    this._data.user = null;
    this._data.overview = null;
    this._data.languages = [];
    this._data.recentActivity = [];
    this._data.insights = null;
    this._data.notifications = { count: 0, items: [] };
    this._data.ui = { sidebarOpen: false, activeTab: 'dashboard', loading: false, error: null, mobileMenuOpen: false };
    Object.keys(this._listeners).forEach(key => this._notify(key, this.get(key)));
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppState };
}
