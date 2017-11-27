[%bs.raw {|require('./App.css')|}];

type element;

let document: element = [%bs.raw {|document|}];

[@bs.send] external addEventListener : (element, string, ReactEventRe.Keyboard.t => unit) => unit =
  "addEventListener";

let images = Images.data;

let gridSize = 3;

let nbOfTiles = gridSize * gridSize;

Random.self_init();

type action =
  | KeyDown(string)
  | TouchStart(float, float)
  | TouchEnd(float, float)
  | NewGame;

type direction =
  | Up
  | Down
  | Left
  | Right
  | None;

type state = {
  startingX: option(float),
  startingY: option(float),
  tiles: list(int),
  isTutorialVisible: bool,
  imageIndex: int
};

let getSwipeDirection = (startX, startY, endX, endY) => {
  let offsetX = int_of_float(endX -. startX);
  let offsetY = int_of_float(endY -. startY);
  let isHorizontalSwipe = abs(offsetX) > abs(offsetY);
  switch (isHorizontalSwipe, offsetX, offsetY) {
  | (true, offsetX, _) when offsetX > 25 => Right
  | (true, offsetX, _) when offsetX < (-25) => Left
  | (false, _, offsetY) when offsetY > 25 => Down
  | (false, _, offsetY) when offsetY < (-25) => Up
  | (_, _, _) => None
  }
};

let (--) = (i, j) => {
  let rec aux = (n, acc) =>
    if (n < i) {
      acc
    } else {
      aux(n - 1, [n, ...acc])
    };
  aux(j, [])
};

let getRandomDirection = () => {
  let rand = Random.int(4);
  switch rand {
  | 0 => Up
  | 1 => Right
  | 2 => Down
  | 3 => Left
  | _ => None
  }
};

let canMove = (emptyTilePosition, direction) =>
  switch direction {
  | Up => emptyTilePosition / gridSize < gridSize - 1
  | Right => emptyTilePosition mod gridSize > 0
  | Down => emptyTilePosition / gridSize >= 1
  | Left => emptyTilePosition mod gridSize < gridSize - 1
  | None => false
  };

let getTileToMove = (emptyTilePosition, direction) =>
  switch direction {
  | Up => emptyTilePosition + gridSize
  | Right => emptyTilePosition - 1
  | Down => emptyTilePosition - gridSize
  | Left => emptyTilePosition + 1
  | None => raise(Not_found)
  };

let swap = (tiles, a, b) =>
  tiles
  |> List.map(
       (tile) =>
         if (tile == a) {
           b
         } else if (tile == b) {
           a
         } else {
           tile
         }
     );

let hasWon = (tiles) => {
  let rec inner = (i, tiles) =>
    switch tiles {
    | [] => true
    | [hd, ...tl] => hd == i ? inner(i + 1, tl) : false
    };
  inner(0, tiles)
};

let initTiles = () => {
  let tiles = 0 -- 8;
  0
  -- 80
  |> List.map((_) => getRandomDirection())
  |> List.fold_left(
       (tls, direction) => {
         let emptyTilePosition = List.nth(tls, nbOfTiles - 1);
         let toMove = getTileToMove(emptyTilePosition, direction);
         if (canMove(emptyTilePosition, direction)) {
           swap(tls, emptyTilePosition, toMove)
         } else {
           tls
         }
       },
       tiles
     )
};

let keyToDirection = (key) =>
  switch key {
  | "ArrowDown" => Down
  | "ArrowUp" => Up
  | "ArrowLeft" => Left
  | "ArrowRight" => Right
  | _ => None
  };

let component = ReasonReact.reducerComponent("App");

let make = (_children) => {
  ...component,
  reducer: (action, state) => {
    let tryToMove = (direction) => {
      let emptyTilePosition = List.nth(state.tiles, nbOfTiles - 1);
      if (hasWon(state.tiles) || ! canMove(emptyTilePosition, direction)) {
        {...state, startingX: None, startingY: None}
      } else {
        {
          ...state,
          isTutorialVisible: false,
          startingX: None,
          startingY: None,
          tiles: swap(state.tiles, emptyTilePosition, getTileToMove(emptyTilePosition, direction))
        }
      }
    };
    switch action {
    | KeyDown(key) => ReasonReact.Update(tryToMove(keyToDirection(key)))
    | TouchStart(x, y) => ReasonReact.Update({...state, startingX: Some(x), startingY: Some(y)})
    | TouchEnd(x, y) =>
      switch (state.startingX, state.startingY) {
      | (Some(startX), Some(startY)) =>
        ReasonReact.Update(tryToMove(getSwipeDirection(startX, startY, x, y)))
      | (None, _) => ReasonReact.NoUpdate
      | (_, None) => ReasonReact.NoUpdate
      }
    | NewGame =>
      ReasonReact.Update({
        ...state,
        tiles: initTiles(),
        imageIndex: (state.imageIndex + 1) mod Array.length(images)
      })
    }
  },
  initialState: () => {
    startingX: None,
    startingY: None,
    tiles: initTiles(),
    isTutorialVisible: true,
    imageIndex: Random.int(Array.length(images))
  },
  didMount: (self) => {
    addEventListener(
      document,
      "keydown",
      self.reduce((event) => KeyDown(ReactEventRe.Keyboard.key(event)))
    );
    ReasonReact.NoUpdate
  },
  render: (self) =>
    <div
      className="Scene"
      onTouchStart=(
        self.reduce(
          (event) => {
            let touches = ReactEventRe.Touch.nativeEvent(event)##touches;
            TouchStart(touches[0]##clientX, touches[0]##clientY)
          }
        )
      )
      onTouchEnd=(
        self.reduce(
          (event) => {
            let touches = ReactEventRe.Touch.nativeEvent(event)##changedTouches;
            TouchEnd(touches[0]##clientX, touches[0]##clientY)
          }
        )
      )>
      <div className="Scene-content">
        (
          self.state.tiles
          |> List.mapi(
               (i, tile) =>
                 <Tile
                   key=(string_of_int(i))
                   originalPosition=i
                   position=tile
                   gridSize
                   source=images[self.state.imageIndex].src
                   isVisible=(i != nbOfTiles - 1)
                 />
             )
          |> Array.of_list
          |> ReasonReact.arrayToElement
        )
      </div>
      <div
        className="Winning-screen"
        style=(
          ReactDOMRe.Style.make(
            ~transition=hasWon(self.state.tiles) ? "" : "none",
            ~opacity=hasWon(self.state.tiles) ? "1" : "0",
            ()
          )
        )>
        (
          if (hasWon(self.state.tiles)) {
            ReasonReact.arrayToElement([|
              <img
                key="solution"
                alt="solution"
                className="Full-image"
                src=images[self.state.imageIndex].src
              />,
              <a key="author" className="Origin-link" href=images[self.state.imageIndex].origin>
                (ReasonReact.stringToElement("By " ++ images[self.state.imageIndex].author))
              </a>
            |])
          } else {
            ReasonReact.nullElement
          }
        )
      </div>
      <div className="Sub-section">
        <span
          className="Tutorial"
          style=(ReactDOMRe.Style.make(~opacity=self.state.isTutorialVisible ? "1" : "0", ()))>
          (ReasonReact.stringToElement("Swipe or use keyboard arrows."))
        </span>
        <button
          key="new-game" className="New-game-button" onClick=(self.reduce((_event) => NewGame))>
          (ReasonReact.stringToElement("New Game"))
        </button>
      </div>
      <div className="About">
        <a href="https://github.com/GuillaumeSalles/8-squares">
          (ReasonReact.stringToElement("About"))
        </a>
      </div>
    </div>
};