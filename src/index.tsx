import Didact from "./packages/Didact";

const Element = (
  <div style="background: salmon">
    1111
    <h1>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>
);

Didact.render(Element, document.getElementById("root"));
