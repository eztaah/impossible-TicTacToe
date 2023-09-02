/*************** Initialization ***************/
function getEl(id){
    return document.getElementById(id);
};

function get_info(id, what) {
    return parseInt(window.getComputedStyle(document.getElementById(id)).getPropertyValue(what));
};


var text_el = getEl('text')
var grid_el = getEl('grid')
var box0 = getEl("box0")
var box1 = getEl("box1")
var box2 = getEl("box2")
var box3 = getEl("box3")
var box4 = getEl("box4")
var box5 = getEl("box5")
var box6 = getEl("box6")
var box7 = getEl("box7")
var box8 = getEl("box8")

var grid = '.........'
var save_grid = []

var end_game = false





/*************** Function ***************/

function test_win(){
    var line1 = grid[0] + grid[1] + grid[2]
    var line2 = grid[3] + grid[4] + grid[5]
    var line3 = grid[6] + grid[7] + grid[8]
    var column1 = grid[0] + grid[3] + grid[6]
    var column2 = grid[1] + grid[4] + grid[7]
    var column3 = grid[2] + grid[5] + grid[8]
    var diagonal1 = grid[0] + grid[4] + grid[8]
    var diagonal2 = grid[6] + grid[4] + grid[2]

    var list_lcd = [line1, line2, line3, column1, column2, column3, diagonal1, diagonal2]

    for(var i=0; i<8; i++){
        if(list_lcd[i] == 'xxx'){
            text_el.innerHTML = "victoire"
            setTimeout(function(){
                end_game = true;
            },1);
        }
        else if(list_lcd[i] == 'ooo'){
            text_el.innerHTML = "Défaite"  /* You lost */
            setTimeout(function(){
                end_game = true;
            },1);
        }
    }

    if(grid.includes('.') == false){
        text_el.innerHTML = 'Match nul'   /* Tie Game */
        setTimeout(function(){
            end_game = true
        },1);
    }

    setTimeout(function(){
        if(end_game){
            console.log(save_grid)
        }
    },1.1);
}




function restart(){
    if(end_game){
        for(var i=0;i<9; i++){
            document.getElementById("box" + String(i)).style.background = ""
            end_game = false
            grid = '.........'
            text_el.innerHTML = ''
            situation = null
            save_grid = []
        }
    }
}




function place_hit(shape, position){
    document.getElementById("box" + String(position)).style.background = "url(./assets/" + shape + ".png) no-repeat center"
    if(shape == 'circle'){
        document.getElementById("box" + String(position)).style.backgroundSize = "70px"
    }
    else{
        document.getElementById("box" + String(position)).style.backgroundSize = "57px"
    }

    new_grid = ''
    for(var i = 0; i < 9; i++){
        if(i == position){
            if(shape == 'cross'){
                new_grid = new_grid + 'x'
            }
            else{
                new_grid = new_grid + 'o'
            }
        }
        else{
            new_grid = new_grid + String(grid[i])
        }
    }
    grid = new_grid
    save_grid.push(grid)

    test_win()
}


function generate_random_pos() {
    return Math.round(Math.random()*(list_pos_random.length)) 
}



function ia_turn(){
    if(grid.includes('.') == true){
        var line1 = grid[0] + grid[1] + grid[2]
        var line2 = grid[3] + grid[4] + grid[5]
        var line3 = grid[6] + grid[7] + grid[8]
        var column1 = grid[0] + grid[3] + grid[6]
        var column2 = grid[1] + grid[4] + grid[7]
        var column3 = grid[2] + grid[5] + grid[8]
        var diagonal1 = grid[0] + grid[4] + grid[8]
        var diagonal2 = grid[6] + grid[4] + grid[2]

        var list_lcd = [[line1, '012'], [line2, '345'], [line3, '678'], [column1, '036'], [column2, '147'], [column3, '258'], [diagonal1, '048'], [diagonal2, '642']]

        var danger_position = []
        var win_position = []

        var end_turn_ia = false




        /*************** First play ***************/
        if(grid.includes('o') == false){

            /***** Counter side-placement *****/
            if((grid[1] == 'x') && (grid.includes('o') == false)){
                place_hit('circle', 0)
                end_turn_ia = true
            }
            else if((grid[5] == 'x') && (grid.includes('o') == false)){
                place_hit('circle', 2)
                end_turn_ia = true
            }
            else if((grid[7] == 'x') && (grid.includes('o') == false)){
                place_hit('circle', 1)
                end_turn_ia = true
            }
            else if((grid[3] == 'x') && (grid.includes('o') == false)){
                place_hit('circle', 0)
                end_turn_ia = true
            }

            /***** Counter corner placement *****/
            else if(((grid[0] == 'x') || (grid[2] == 'x') || (grid[6] == 'x') || (grid[8] == 'x'))){
                place_hit('circle', 4)
                end_turn_ia = true
            }

            /***** Counter center placement *****/
            else if(grid[4] == 'x'){
                place_hit('circle', 0)
                end_turn_ia = true
            }
        }




        /*************** Instant win ? ***************/
        if(end_turn_ia == false){
            for(var i=0; i<8; i++){
                if(list_lcd[i][0] == '.oo'){
                    win_position.push(list_lcd[i][1][0])
                }
                else if(list_lcd[i][0] == 'o.o'){
                    win_position.push(list_lcd[i][1][1])
                }
                else if(list_lcd[i][0] == 'oo.'){
                    win_position.push(list_lcd[i][1][2])
                }
            }
            if(win_position.length >= 1){
                place_hit('circle', win_position[0])
                end_turn_ia = true
            }
        }





        /*************** Instant danger ? ***************/
        if(end_turn_ia == false){
            for(var i=0; i<8; i++){
                if(list_lcd[i][0] == '.xx'){
                    danger_position.push(list_lcd[i][1][0])
                }
                else if(list_lcd[i][0] == 'x.x'){
                    danger_position.push(list_lcd[i][1][1])
                }
                else if(list_lcd[i][0] == 'xx.'){
                    danger_position.push(list_lcd[i][1][2])
                }
            }
            if(danger_position.length >= 1){
                place_hit('circle', danger_position[0])
                end_turn_ia = true
            }
        }



        /*************** Take center if empty ***************/
        if(end_turn_ia == false){
            if(grid[4] == '.'){
                place_hit('circle', 4)
                end_turn_ia = true
            }
        }




        /*************** Special case ***************/

        if(end_turn_ia == false){

            /***** Case 1 *****/
            if(grid == 'xo.....x.'){
                place_hit('circle', 6)
                end_turn_ia = true
            }

            /***** Case 2 *****/
            if(grid == '.ox....x.'){
                place_hit('circle', 8)
                end_turn_ia = true
            }

            /***** Case 3 *****/
            if((diagonal1 == 'oxx') || (diagonal1 == 'xxo') || (diagonal2 == 'oxx') || (diagonal2 == 'xxo')){
                liste_coin_dispo = []
                coins = [0, 2, 6, 8]
                for(var i=0; i<8; i++){
                    if(grid[coins[i]] == '.'){
                        liste_coin_dispo.push(coins[i])
                    }
                }
                if(liste_coin_dispo.length != 0){
                    place_hit('circle', liste_coin_dispo[0])
                    end_turn_ia = true
                }
            }

            /***** Case 4 *****/
            if((diagonal1 == 'xox') || (diagonal2 == 'xox')){
                var n = 0
                for(var i=0; i<9; i++){
                    if(grid[i] == 'o'){
                        n = n + 1
                    }
                }
                if(n == 1){
                    place_hit('circle', 1)
                    end_turn_ia = true
                }
            }

            /***** Case 5 *****/
            if(grid == 'x...o..x.'){
                place_hit('circle', 3)
                end_turn_ia = true
            }
        }



        /*************** Random position ***************/
        if(end_turn_ia == false){
            console.log('random')
            var list_pos_dispo = []
            for(var i = 0; i < 9; i++){
                if((grid[i] != 'x') && (grid[i] != 'o')){
                list_pos_dispo.push(i)
                }
                pos_dispo = list_pos_dispo[0]
            }   
            console.log(list_pos_dispo)
            place_hit('circle', pos_dispo)
            end_turn_ia = true
        }
    }
}





function click_animation(){
    grid_el.style.transition = '0.08s'
    grid_el.style.height = '312px'
    grid_el.style.backgroundSize = '312px'
    grid_el.style.width = '306px'

    var distance_web_game_left = (document.documentElement.scrollWidth - 306)/2
    var distance_web_game_top = (document.documentElement.scrollHeight - 312)/2
    grid_el.style.top = distance_web_game_top + 'px'
    grid_el.style.left = distance_web_game_left + 'px'

    
    for(var i=0;i<9; i++){
        var old_left = get_info('box' + String(i), "left")
        document.getElementById("box" + String(i)).style.left = old_left + 2 + "px"
        var old_top = get_info('box' + String(i), "top")
        document.getElementById("box" + String(i)).style.top = old_top + 2 + "px"

        if(grid[i] == 'o'){
            document.getElementById("box" + String(i)).style.background = "url(./assets/circle.png) no-repeat center"
            document.getElementById("box" + String(i)).style.backgroundSize = "72px"
        }
        else if(grid[i] == 'x'){
            document.getElementById("box" + String(i)).style.background = "url(./assets/cross.png) no-repeat center"
            document.getElementById("box" + String(i)).style.backgroundSize = "59px"
        }
        


    }

    setTimeout(function(){        
        grid_el.style.height = '306px'
        grid_el.style.backgroundSize = '306px'
        grid_el.style.width = '300px'

        var distance_web_game_left = (document.documentElement.scrollWidth - 300)/2
        var distance_web_game_top = (document.documentElement.scrollHeight - 300)/2
        grid_el.style.top = distance_web_game_top + 'px'
        grid_el.style.left = distance_web_game_left + 'px'

        for(var i=0;i<9; i++){
            var old_left = get_info('box' + String(i), "left")
            document.getElementById("box" + String(i)).style.left = old_left - 2 + "px"
            var old_top = get_info('box' + String(i), "top")
            document.getElementById("box" + String(i)).style.top = old_top - 2 + "px"
    
    
            if(grid[i] == 'o'){
                document.getElementById("box" + String(i)).style.background = "url(./assets/circle.png) no-repeat center"
                document.getElementById("box" + String(i)).style.backgroundSize = "70px"
            }
            else if(grid[i] == 'x'){
                document.getElementById("box" + String(i)).style.background = "url(./assets/cross.png) no-repeat center"
                document.getElementById("box" + String(i)).style.backgroundSize = "57px"
            }
    
    
        }

        setTimeout(function(){
            grid_el.style.transition = '0s'
        }, 50)
    },80);


    

}






/*************** Player placement ***************/

function cross_b0(){
    if(grid[0] == '.'){
        place_hit("cross", 0)
        ia_turn()
        click_animation()
    }
}
function cross_b1(){
    if(grid[1] == '.'){
        place_hit("cross", 1)
        ia_turn()
        click_animation()
    }
}
function cross_b2(){
    if(grid[2] == '.'){
        place_hit("cross", 2)
        ia_turn()
        click_animation()
    } 
}
function cross_b3(){
    if(grid[3] == '.'){
        place_hit("cross", 3)
        ia_turn()
        click_animation()
    }
}
function cross_b4(){
    if(grid[4] == '.'){
        place_hit("cross", 4)
        ia_turn()
        click_animation()
    }
}
function cross_b5(){
    if(grid[5] == '.'){
        place_hit("cross", 5)
        ia_turn()
        click_animation()
    }
}
function cross_b6(){
    if(grid[6] == '.'){
        place_hit("cross", 6)
        ia_turn()
        click_animation()
    }
}
function cross_b7(){
    if(grid[7] == '.'){
        place_hit("cross", 7)
        ia_turn()
        click_animation()
    }
}
function cross_b8(){
    if(grid[8] == '.'){
        place_hit("cross", 8)
        ia_turn()
        click_animation()
    }
}





/*************** Display ***************/
setInterval(function(){
    var distance_web_game_left = (document.documentElement.scrollWidth - 306)/2
    var distance_web_game_top = (document.documentElement.scrollHeight - 300)/2


    grid_el.style.top = distance_web_game_top + 'px'
    grid_el.style.left = distance_web_game_left + 'px'

    text_el.style.top = distance_web_game_top - 70 + 'px'
    text_el.style.left = distance_web_game_left + 'px'
}, 10)