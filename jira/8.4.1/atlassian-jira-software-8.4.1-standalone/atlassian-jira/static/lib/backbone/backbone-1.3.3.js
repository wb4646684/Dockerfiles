define('jira/backbone-1.3.3', [
    'jquery', // According to docs required dependency is jQuery ( >= 1.11.0), no specific version available in js-libs
    'atlassian/libs/underscore-1.8.3',
    'atlassian/libs/factories/backbone-1.3.3',
], function ($,
             _,
             BackboneFactory) {
    return BackboneFactory(_, $);
});