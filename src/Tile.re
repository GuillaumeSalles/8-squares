[%bs.raw {|require('./Tile.css')|}];

let tileSpacing = "1px";

let tileSpacingTransform = "translateX(-" ++ tileSpacing ++ ") translateY(-" ++ tileSpacing ++ ")";

let floatToCssPercent = (f) => Printf.sprintf("%f%%", f);

let component = ReasonReact.statelessComponent("Tile");

let make = (~originalPosition, ~position, ~gridSize, ~isVisible, ~source, _children) => {
  ...component,
  render: (_self) => {
    let posX = position mod gridSize * 100;
    let posY = position / gridSize * 100;
    let transform =
      "translateX(" ++ string_of_int(posX) ++ "%) translateY(" ++ string_of_int(posY) ++ "%)";
    let width = string_of_float(100. /. float_of_int(gridSize)) ++ "%";
    let offsetX = float_of_int(originalPosition mod gridSize) /. float_of_int(gridSize) *. 100.;
    let offsetY =
      floor(float_of_int(originalPosition) /. float_of_int(gridSize))
      /. float_of_int(gridSize)
      *. 100.;
    let imageTransform =
      "translateX(-"
      ++ floatToCssPercent(offsetX)
      ++ ") translateY(-"
      ++ floatToCssPercent(offsetY)
      ++ ") "
      ++ tileSpacingTransform;
    <div
      className="Tile"
      style=(
        ReactDOMRe.Style.make(~visibility=isVisible ? "visible" : "hidden", ~transform, ~width, ())
      )>
      <div className="Tile-content" style=(ReactDOMRe.Style.make(~margin=tileSpacing, ()))>
        <img
          className="Tile-source"
          style=(ReactDOMRe.Style.make(~transform=imageTransform, ()))
          src=source
        />
      </div>
    </div>
  }
};