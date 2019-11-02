define('jira/backbone.radio-2.0', [
    'atlassian/libs/underscore-1.8.3',
    'jira/backbone-1.3.3',
    'atlassian/libs/factories/backbone.radio-2.0.0'
], function (
    _,
    Backbone,
    BackboneRadioFactory
) {
    return BackboneRadioFactory(_, Backbone);
});
