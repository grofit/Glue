# Glue

Glue is a lightweight dependency manager for javascript, or if you prefer a instance locator.
It was originally going to be able to do dependency injection, however due to the lack of good cross browser
javascript reflection, it ended up being a simple dependency manager.

## Binding Elements
```javascript
var Glue = new Glue(); // Global Glue Instance
Glue.Bind("MyInstance").To(new MyInstance()); // Bind a new instance to the key "MyInstance"
```

Binding is case insensitive, so "MyInstance" would match "myInstance" and "MyInStAnCe" etc.

## Accessing Binding
```javascript
var instance = Glue.Get("MyInstance");
```

This will return the given instance for the key

## How is this useful?

Well to most people it wont be, but lets say that you have an Ajax service of sorts and you are currently using 
a Jquery implementation.

```javascript
var Glue = new Glue();
Glue.Bind("AjaxService").To(new JqueryAjaxService());

function MyClass = function() {
	this.DoAjaxCall = function(url) {
		var ajaxService = Glue.Get("AjaxService");
		ajaxService.Call(url);
	};
}
```

Then someone says OH NO! we need to now start using a different implementation, you can then simply replace the above 
with this:

```javascript
var Glue = new Glue();
Glue.Bind("AjaxService").To(new AlternativeAjaxService());

function MyClass = function() {
	this.DoAjaxCall = function(url) {
		var ajaxService = Glue.Get("AjaxService");
		ajaxService.Call(url);
	};
}
```

No code change within your actual implementations, it is just a configuration detail, so you are able to continue on as you were.

Granted you can still achieve the same sort of functionality by passing this ajaxService in through the constructor, and that 
would make the class slightly easier to test as you wouldnt need a dependency on Glue. However there is one niche area where Glue 
shines.

## Dynamic clientside configuration (or in my case Plugins)

Glue was originally designed to be a lightweight way to allow plugins to interact with services and other instances without having to be 
passed the information. It also doubles up as a flexible way to change in and out instances on the fly.

So taking the example above, lets say your AjaxService raises a couple of events like so:

```javascript
function JqueryAjaxService() {
	this.Call = function(url) {
		var ajaxOptions = { 
			url: url,
			success: function(data) { RaiseEvent("OnAjaxSuccess", data); },
			error: function(xhr, description, error) { RaiseEvent("OnAjaxError", error); }
		};			
		$.ajax(url);
	};
}
```

You then need something to handle these events, lets say you only care about success and want to just alert failures to the screen.

```javascript
function MyClass() {
	ListenForEvent("OnAjaxSuccess", OnSuccess);
	ListenForEvent("OnAjaxError", OnError);
		
	this.DoAjaxCall = function(url) {
		var ajaxService = Glue.Get("AjaxService");
		ajaxService.Call(url);
	}
	
	var OnSuccess = function(data) {
		// Do Something success related
	};
	
	var OnError = function(error) {
		var errorHandler = Glue.Get("ErrorHandler");
		errorHandler.DisplayError(error);
	}
}
```

Now I know this is getting quite long winded, but stick with me here. We now need a way to handle errors, lets say we used a simple alerter.

```javascript
function AlertingErrorHandler() {
	this.DisplayError = function(error) {
		alert(error);
	};
};
Glue.Bind("ErrorHandler").To(new AlertingErrorHandler());
```

Woohoo so now every time that an ajax error happens, it will throw an alert, brilliant. Then someone decides that they want to write a plugin to add
a growl style notification for when errors occur. They then write something like below and lets say you have a mechanism for a user to load the plugin 
in dynamically.

```javascript
function GrowlErrorHandlerPlugin() {
	this.OnPluginInit = function() {
		Glue.Bind("ErrorHandler").To(new GrowlErrorHandler());
	};
};

function GrowlErrorHandler() {
	this.DisplayError = function(error) {
		SomeGrowlStuff(error);
	}
}
```

Kapow, this would then, without re-loading the page mean that the existing functionality would now display errors in a growl way, rather than in an alert fashion.

I know that was long winded but see the examples for a quick and simpler version.