define("jira/featureflags/feature-manager",["wrm/data","exports"],function(e,a){var r=e.claim("jira.core:feature-flags-data.feature-flag-data"),t=r&&r["enabled-feature-keys"]||[],f=r&&r["feature-flag-states"]||{},n=function(e,a){return-1!==e.indexOf(a)};a.isFeatureEnabled=function(e){var a=f[e];if(!0===a){return!n(t,e+".disabled")}if(!1===a){return n(t,e+".enabled")}return n(t,e)}});