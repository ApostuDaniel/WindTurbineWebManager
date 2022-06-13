function popUp(id)
{
    var popUp = document.getElementById(id);

    if(popUp.style.visibility === "hidden")
    {
        popUp.style.visibility = "visible";
    }
    else
    {
        popUp.style.visibility = "hidden";
    }
}