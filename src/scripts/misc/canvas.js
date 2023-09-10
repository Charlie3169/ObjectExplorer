
"use strict";

// Wait for page to render before starting the JS Code
window.onload = function()  
{
    // DONT CHANGE THIS
   // get the canvas - defined in the HTML doc 
   var canvas = document.getElementById("myCanvas");
   
   // Get the 2D graphic context for writing 
   var ctx = canvas.getContext("2d");
   ctx.lineWidth = 7;
   
   // A function to take the color values for an rgb triple and return a color
   // that you can use with setStroke() or setFill()
     function color(r, g, b) 
     {
         var rVal, gVal, bVal;
         
         rVal = Number(r).toString(16);
         rVal = rVal.length === 1 ? "0" + rVal : rVal;
         
         gVal = Number(g).toString(16);
         gVal = gVal.length === 1 ? "0" + gVal : gVal;
         
         bVal = Number(b).toString(16);
         bVal = bVal.length === 1 ? "0" + bVal : bVal;
         
         return "#" + rVal + bVal + gVal;
      }
   
     var r, g, b, a, radius, arc1, arc2, startX, startY, endX, endY;
     var x, y, x1, y1, x2, y2, x3, y3, x4, y4, cx, cy, cx1, cy1, width, height;
   
     // How to get a randome color
     // get the RGB element for random Stroke Color 
       r = Math.floor(Math.random() * 256);
       g = Math.floor(Math.random() * 256);
       b = Math.floor(Math.random() * 256);		 
       // set the stroke color to it
       ctx.strokeStyle = color(r,g,b); 
       
      // get a random location on the canvas
      x = Math.floor(Math.random() * canvas.width); 
      y = Math.floor(Math.random() * canvas.height);

      // get a random center point or control point
      cx = Math.floor(Math.random() * canvas.width); 
      cy = Math.floor(Math.random() * canvas.height);

      // get another random control point
      cx1 = Math.floor(Math.random() * canvas.width); 
      cy1 = Math.floor(Math.random() * canvas.height);	
 
   // Put your code here after this point in the file.  You can comment out or 
   // delete the examples
   // You can use them initially to make sure the project works          
               
        
var i;
var j;

radius = 13;

for (i = 0; i < (canvas.width + (canvas.width / radius)); i += (canvas.width / radius)) 
{
    
    for (j = 0; j < (canvas.height + (canvas.height / radius)); j += (canvas.height / radius)) 
    {
        switch(Math.floor((Math.random() * 8)))
        {
            case 0:
                ctx.strokeStyle = "#FF0000";
                
                break;
                
            case 1:
                ctx.strokeStyle = "#FF8000";
                break;
                
            case 2:
                ctx.strokeStyle = "#FFFF00";
                break;
                
            case 3:
                ctx.strokeStyle = "#00FF00";
                break;
                
            case 4:
                ctx.strokeStyle = "#00FFFF";
                break;
                
            case 5:
                ctx.strokeStyle = "#0000FF";
                break;
                
            case 6:
                ctx.strokeStyle = "#8000FF";
                break;
            
            case 7:
                ctx.strokeStyle = "#FF00FF";
                break;
                
        }
        
        ctx.beginPath();       
        ctx.arc(i,j,radius,0,2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();       
        ctx.arc(i,j,radius * 5,0,2 * Math.PI);
        ctx.stroke();                                            
        
        
    }
      

}
        
        
   
              
   
    
};  

