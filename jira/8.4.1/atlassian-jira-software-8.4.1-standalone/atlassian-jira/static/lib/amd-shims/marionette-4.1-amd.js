define('jira/marionette-4.1', [
    'atlassian/libs/underscore-1.8.3',
    'jira/backbone-1.3.3',
    'jira/backbone.radio-2.0',
    'atlassian/libs/factories/marionette-4.1.2',
    'jira/marionette/marionette.mixins'
], function (
    _,
    Backbone,
    BackboneRadio,
    MarionetteFactory,
    marionetteMixins
) {
    const  marionette = MarionetteFactory(_, Backbone, BackboneRadio);

    _.extend(marionette.View.prototype, marionetteMixins.viewExtensions);
    _.extend(marionette.CollectionView.prototype, marionetteMixins.viewExtensions);
    return marionette;
});