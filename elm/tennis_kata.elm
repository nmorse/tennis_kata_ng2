import Html exposing (..)
import Html.App as App
import Html.Events exposing (..)
import Html.Events exposing (onClick)


main =
  App.program { init = init, view = view, update = update, subscriptions = subscriptions }

type Score = Start
    | All
    | P1Ahead | P2Ahead
    | Deuce | P1Adv | P2Adv
    | P1Game | P2Game


type alias Model =
  { p1_points: Int, p2_points: Int, game_state: Score }

init: (Model, Cmd Msg)
init = ({p1_points = 0, p2_points = 0, game_state = Start}, Cmd.none)

view model =
  div []
    [ button [ onClick Point_P1 ] [ text "P1" ]
    , div [] [ text (viewScore model.p1_points) ]
    , div [] [ text (toString model.game_state) ]
    , div [] [ text (viewScore model.p2_points) ]
    , button [ onClick Point_P2 ] [ text "P2" ]
    ]

viewScore s = 
  case s of
    0 ->
      "Love"
    1 ->
      "15"
    2 ->
      "30"
    3 ->
      "40"
    _ ->
      "40 +"
    

type Msg = Point_P1 | Point_P2

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
  let
  up_the_score = 
    if model.game_state == P1Game || model.game_state == P2Game then
      (\s -> s)
    else 
      (\s -> s + 1)
  in
    case msg of
      Point_P1 ->
        ({model | p1_points = up_the_score model.p1_points, game_state = set_state model 1 }, Cmd.none)
      Point_P2 ->
        ({model | p2_points = up_the_score model.p2_points, game_state = set_state model 2 }, Cmd.none)
      

set_state: Model -> Int -> Score
set_state m p =
  let 
    p1 = 
      if p == 1 then m.p1_points + 1 else m.p1_points
    p2 = 
      if p == 2 then m.p2_points + 1 else m.p2_points
  in
   case m.game_state of
     Start ->
      if p == 1 then 
        P1Ahead
      else  
        P2Ahead
     P1Ahead ->
      if p == 1 && p1 >= forty  then 
        P1Game
      else if p == 1 then 
        P1Ahead
      else if p == 2 && p1 == p2 then
        if p1 >= forty then
          Deuce
        else
          All
      else
        P1Ahead
     P2Ahead ->
      if p == 2 && p2 >= forty then 
        P2Game
      else if p == 2 then 
        P2Ahead
      else if p == 1 && p1 == p2 then
        if p2 >= forty then
          Deuce
        else
          All
      else
        P2Ahead
     All ->
      if p == 1 then 
        P1Ahead
      else  
        P2Ahead
     Deuce ->
      if p == 1 then 
        P1Adv
      else  
        P2Adv
     P1Adv ->
      if p == 1 then 
        P1Game
      else  
        Deuce
     P2Adv ->
      if p == 2 then 
        P2Game
      else  
        Deuce
     P1Game ->
       P1Game
     P2Game ->
       P2Game
  
forty = 3

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none
