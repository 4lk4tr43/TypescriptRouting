TypescriptRouting
=================

Minimalistic routing engine for typescript
<hr>


<h3>Usage</h3>
<ol>
<li>Add routing.js to your html</li>
<li>Derive a class from Meta.Annotated</li>
<li>Insert 'Routing.Annotations.Route' into a class method to handle hash changes to the route</li>
<li>(optional) Define routes on your own by adding arguments to the annotation. E.g. 'Routing.Annotations.Route={"path":".*", "register":false}';
</ol>
<br>
<i>The class will be extended with the methods</i>
<ul>
<li>getRoutes():Route[]   // gets all routes that belong to the instance</li>
<li>registerAll():void    // activates all routes on the instance</li>
<li>unregisterAll():void  // unregisters all routes on the instance</li>
</ul>
<br>
<pre>
class MyController extends Meta.Annotated {
  a(intA, floatOptionalB) {
    'Routing.Annotations.Route';
    // execute code when hash matches #MyController/a/\d+(\\d*\.\d+)?
  }
  aMiss() {
    // executed when a is missed
  }
  b() {
    'Routing.Annotations.Route={"path":"ROUTEB", "register":false}';
    // execute code when hash matches #ROUTEB
  }
}

var myCtrl = new MyController();

// routeRegexString, funcHit, funcMiss, register, contextForHitMiss
Routing.RoutingManager.bypass = new Route(undefined, ()=>{/*all missed*/, undefined, false, myCtrl);
</pre>
<hr>
<b>More information can be found in the file comments</b>
<hr>
Collaborators are always welcome!
