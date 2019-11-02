AJS={$:jQuery};(function(a){a(function(){var g=a("body");
if(g.hasClass("error500")){a(".technical-details-header").click(function(){a(".technical-details").toggleClass("js-hidden");
a(this).toggleClass("opened")
})
}if(g.hasClass("new-installation-old-license")){var d=a("#confirm-new-installation-form-area");
if(a("#confirm-new-installation-radio-options").length){var c=a("#confirm-new-installation-radio-options");
var f=c.find('input[type="radio"]');
var e=c.data("option");
var b={license:a("#confirm-new-installation-license-area"),evaluation:a("#confirm-new-installation-evaluation-area"),"remove-expired":a("#confirm-new-installation-remove-expired-area")};
f.on("change",function(){var h=a(this).val();
d.html(b[h].html()).removeClass("hidden")
});
f.filter('[value="'+(e||"license")+'"]').change().prop("checked",true)
}}})
})(jQuery||Zepto);