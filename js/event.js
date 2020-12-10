function board_reset(){
    selectChange();
    choose_window();
    choose_polygon();
}

function choose_polygon()
{
    points_1=[];
    len_1=0;
    object='polygon';
    points_1[0] = [0,0];
    f1_board.html('');
    tr_reset();
}

function choose_window()
{
    points_2=[];
    len_2=0;
    object='window';
    points_2[0] = [0,0];
    f2_board.html('');
    tr_reset();
}

function cut()
{
    cut_polygon_array();
    cut_window_array();
    weilerr_Atherton();
}