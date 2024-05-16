class MorphingText
{

    constructor(elem, texts, doForever = true)
    {
        this.elem = elem;
        this.text1 = elem.children[0];
        this.text2 = elem.children[1];
        this.textIndex = 0;
        this.texts = [this.text1.textContent, this.text2.textContent];
        this.cooldownTime = doForever ? 0.8 : -0.1;
        this.morphTime = 0.8;
        this.doForever = doForever;
        elem.style.filter = "blur(0.03rem) url(#threshold)";
        this.colorFrom = "#255255";
        this.isMorhing = false;
        this.isUnderNav = false;
        this.morphText();
    }

    morphText()
    {
        if (this.isMorhing) return;
        this.isMorhing = true;

        let text1 = this.text1;
        let text2 = this.text2;
        //set the position of the text to be in the same place


        let morphTime = this.morphTime;
        let morph = 0;
        let cooldownTime = this.cooldownTime;
        let cooldown = this.cooldownTime;
        let time = new Date();
        let doForever = this.doForever;
        text1.textContent = this.texts[this.textIndex % this.texts.length];
        text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];
        this.colorFrom = getComputedStyle(text1).color;
        let that = this;
        const color_light = "#F2C029";
        const color_dark = "#8D2A58";
        const color_darker = "#38242D";


        function doMorph()
        {
            //morph is the time that the text is morphing
            morph -= cooldown;
            cooldown = 0;

            let fraction = morph / morphTime;

            if (fraction > 1)
            {
                cooldown = cooldownTime;
                fraction = 1;
            }

            setMorph(fraction);
        }

        function setMorph(fraction)
        {
            //set the blur and opacity of the text
            //this function is called in doMorph every frame until the fraction is 1 and then the cooldown starts
            text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            fraction = 1 - fraction;
            text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            text1.textContent = that.texts[that.textIndex % that.texts.length];
            text2.textContent = that.texts[(that.textIndex + 1) % that.texts.length];
        }

        function doCooldown()
        {
            //cooldown is the time that the text is not morphing
            morph = 0;

            text2.style.filter = "";
            text2.style.opacity = "100%";

            text1.style.filter = "";
            text1.style.opacity = "0%";


        }

        function RGBFormatToHEX(color)
        {
            //the color is a string in the format rgb(r, g, b) and the function returns an hex string
            let rgb = color.match(/\d+/g);
            let hex = "#";
            for (let i = 0; i < 3; i++)
            {
                //parse as hex number and convert to string
                hex += parseInt(rgb[i]).toString(16);
            }
            //change the color to uppercase
            return hex.toUpperCase();
        }

        this.smoothDamp = function (current, target, smoothTime, maxSpeed, dt)
            {
                //if current starts with #, then it is a hex color
                if (current[0] === "#")
                {
                    //convert hex to rgb
                    current = current.match(/\w\w/g);
                    current = current.map((hex) => parseInt(hex, 16));
                } else
                {
                    //if current is not a hex color, then it is a rgb color
                    current = current.match(/\d+/g);
                    current = current.map((num) => parseInt(num));
                }
                //if target starts with #, then it is a hex color
                if (target[0] === "#")
                {
                    //convert hex to rgb
                    target = target.match(/\w\w/g);
                    target = target.map((hex) => parseInt(hex, 16));
                } else
                {
                    //if target is not a hex color, then it is a rgb color
                    target = target.match(/\d+/g);
                    target = target.map((num) => parseInt(num));
                }
                //console.log(RGBFormatToHEX(current[0] + ","+current[1]+","+current[2]),RGBFormatToHEX(target[0] + ","+target[1]+","+target[2]));
                let currentColor = current;
                let targetColor = target;
                //console.log (currentColor, targetColor);
                let color = [];
                for (let i = 0; i < 3; i++)
                {
                    let diff = targetColor[i] - currentColor[i];
                    //if the difference is less than 2, then the color is the target color

                    if (Math.abs(diff) < 5)
                    {
                        color.push(targetColor[i]);
                        continue;
                    }
                    let speed = Math.min(maxSpeed, Math.abs(diff) / smoothTime);
                    let change = speed * dt;
                    change = Math.sign(diff) * Math.min(Math.abs(diff), change);
                    color.push(parseInt(currentColor[i]) + change);
                }
                return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            };
        this.animate = function ()
            {
                requestAnimationFrame(that.animate);
                //check if there is an aria label for hidden text
                if (that.elem.ariaLabel == "hidden")
                {
                    return;
                }


                let newTime = new Date();
                let shouldIncrementIndex = cooldown > 0;
                let dt = (newTime - time) / 1000;
                time = newTime;
                //check if nav rect collides with text rect
                let nav = document.querySelector("nav");
                //get position of the text
                let pos = text1.getBoundingClientRect();
                //text1 is sticky, so we need to add the top of the sticky element
                let s = scrollY > pos.top ? {top: 0} : {top: pos.top - scrollY};
                let collides = pos.top + s.top < nav.getBoundingClientRect().y + nav.getBoundingClientRect().height / 2;
                let text1col = RGBFormatToHEX(getComputedStyle(text1).color);
                let text2col = RGBFormatToHEX(getComputedStyle(text2).color);

                if (!that.isUnderNav)
                {

                    //console.log(pos.top + s.top, nav.getBoundingClientRect().y + nav.getBoundingClientRect().height /2, collides)
                    if (collides)
                    {
                        //console.log("under nav")
                        that.isUnderNav = true;
                        //if there is a nav, then smoothly change color of the text
                        let navColor = getComputedStyle(nav).backgroundColor;
                        navColor = RGBFormatToHEX(navColor);
                        //if color = dark
                        if (navColor === color_darker)
                        {
                            that.colorFrom = color_light;
                        } else if (navColor === color_light)
                        {
                            that.colorFrom = color_dark;
                        }
                    } else
                    {
                        //if there is no nav under the text, then smoothly change the color to the original color
                        text1.style.color = that.smoothDamp(text1col, that.colorFrom, 0.001, 5, 1);

                        text2.style.color = that.smoothDamp(text2col, that.colorFrom, 0.001, 5, 1);
                    }
                } else
                {
                    if (!collides) that.colorFrom = color_dark;
                    //console.log(that.colorFrom)
                    //if there is no nav under the text, then smoothly change the color to the original color
                    text1.style.color = that.smoothDamp(text1col, that.colorFrom, 0.01, 5, 1);

                    text2.style.color = that.smoothDamp(text2col, that.colorFrom, 0.01, 5, 1);
                    //console.log(text1col, text2col, that.colorFrom)
                    if (text1col === that.colorFrom || text2col === that.colorFrom)
                    {
                        that.isUnderNav = false;
                        //console.log("reset")
                        if (that.colorFrom === color_light)
                        {
                            that.colorFrom = color_dark;
                        }
                    }
                }
                //console.log(that.colorFrom);
                cooldown -= dt;
                if (!doForever && morph >= morphTime)
                {
                    //change the text index
                    that.textIndex++;
                    //stop animation frame request
                    cancelAnimationFrame(that.animate);
                    that.isMorhing = false;
                    return;
                }
                if (cooldown <= 0)
                {
                    if (shouldIncrementIndex)
                    {
                        that.textIndex++;
                    }

                    doMorph();
                } else
                {
                    doCooldown();
                }
            };

        that.animate();
    }

}

