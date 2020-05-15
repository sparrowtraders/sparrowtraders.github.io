(function () {
    var couponsEnabled = true
  
    var scripts = [
      'https://checkout.stripe.com/checkout.js',
      'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/js-url/2.5.3/url.min.js',
    ]
  
    if (!window.jQuery) {
      scripts.push('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js')
    }
  
    loadScripts(scripts, function () {
      initEmbed()
      loadCSS('https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css')
      loadCSS('https://cdn.jsdelivr.net/npm/load-awesome@1.1.0/css/ball-spin-fade.min.css')
      loadCSS('https://cdn.jsdelivr.net/npm/load-awesome@1.1.0/css/line-scale.css')
    })
  
    function loadCSS(styleLink) {
      var element = document.createElement("link");
      element.setAttribute("rel", "stylesheet");
      element.setAttribute("type", "text/css");
      element.setAttribute("href", styleLink);
      document.getElementsByTagName("head")[0].appendChild(element);
    }
  
    function loadScripts(array, callback) {
      var loader = function (src, handler) {
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function () {
          script.onreadystatechange = script.onload = null;
          handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild(script);
      };
      (function run() {
        if (array.length != 0) {
          loader(array.shift(), run);
        } else {
          callback && callback();
        }
      })();
    }
  
    // TODO: read the loader html from another file
    function initLoadingScreen() {
      jQuery('body').append('<div class="launchPassLoader" style="display: none; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: #00000063">   <div style="display: flex; justify-content: center; align-items: center;">     <div style="width: 500px; height: 130px; background-color: white; text-align: center; margin-top: 100px; border-radius: 8px; padding-top: 10px;">       <div>         <h2>           Generating invite. If you arenâ€™t redirected shortly, check your email. ðŸš€         </h2>            <span>            Please wait...         </span>        </div>       <div class="la-line-scale la-2x" style="margin: 20px auto;">         <div style="background-color: white;"></div>         <div style="background-color: white;"></div>         <div style="background-color: white;"></div>         <div style="background-color: white;"></div>         <div style="background-color: white;"></div>       </div>     </div>   </div> </div>')
    }
  
    function initEmbed() {
      console.log('loaded launchpass embed...')
      var validCoupon = null
      var couponDesc = null
      var urlCoupon = url('?coupon') || '' // set to empty string if empty
      var urlEmail = url('?email') || '' // set to empty string if empty
  
      initLoadingScreen()
  
      if (typeof StripeCheckout === 'undefined') return;
      var handler = StripeCheckout.configure({
        key: 'pk_live_j3AMF8zGT0vqEsyZxgxyXhst',
        image: 'https://res.cloudinary.com/arcjet-media/image/upload/c_scale,w_256/v1588996301/udqx8sizeuh3kortgyou.jpg',
        locale: 'auto',
        token: function (token) {
          if ('discord' === 'discord') {
            window.scrollTo(0,0)
            jQuery('.launchPassLoader').css('display', 'block')
          }
          jQuery.post('https://api.launchpass.com/widget', ({
            token: token,
            key: 'pk_live_j3AMF8zGT0vqEsyZxgxyXhst',
            sp: '5701389762428928',
            ownerId: '5965554779422720',
            validCoupon: validCoupon,
          }), function (data) {
            if (data) {
              if (data.message === 'already_in_team' || data.message === 'Success') {
                
                if (data.discordInviteLink) {
                  window.location.replace(data.discordInviteLink);
                  return;
                }
                if ('https://www.sparrowtraders.com' !== 'null' && 'https://www.sparrowtraders.com'.length !== 0) {
                  window.location.replace("https://www.sparrowtraders.com");
                }
              }
              if (data.message === 'already_in_team') {
                swal('Success!', "Thanks for joining! A subscription has been created for you. You've been added to the premium channel. If you have any questions, please contact support@launchpass.com", "success")
              } else if (data.message === 'already_invited') {
                swal('Attention! Read below:', "A subscription has been created for you. It looks like you have a pending invitation to this group. Please accept the invitation. Feel free to reach out to the group administrator or support@launchpass.com for help", "warning")
              } else if (data.message === 'Success') {
                swal('Success!', "Thanks for joining! Your invitation is being prepared and should show up in your email inbox soon. If you have any questions, please contact support@launchpass.com", "success")
              } else if (data.message === 'user_disabled') {
                swal('Attention! Read below:', "It looks like you already have an account in this group but it is disabled. Feel free to contact the group administrator for more information.", "warning")
              } else if (data.message === 'channel_not_found') {
                swal('Attention! read below:', "It looks like that channel does not exist. Contact the group admin or us at support@launchpass.com for more information.", "warning")
              } else if (data.message === 'user_already_exists') {
                swal('Attention! Read below:', "You are already paying for a subscription to this group. Contact support@launchpass.com if you have any further questions", "warning")
              } else {
                swal('Uh oh!', "It looks like there was an error: " + data.message + ". Please contact support@launchpass.com", "warning")
              }
            } else {
              console.log("Error")
            }
          })
        }
      });
  
      var btns = document.querySelectorAll('.lp5701389762428928');
      var bgColor = jQuery('.lp5701389762428928').css('background-color')
  
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function (e) {
          handler.open({
            name: "sparrow",
            email: urlEmail,
            description: validCoupon ? couponDesc : "$35 / monthly",
            panelLabel: "Start Your Trial"
          });
  
          e.preventDefault();
        });
  
        if (true) {
          jQuery(btns[i]).parent().append(
          `<a style="
              display: inline-block;
              padding: 8px 0;
              font-family: sans-serif;
              cursor: pointer;
              color: ` + bgColor + `" 
              class="couponLink">
                  Enter Coupon Code
          </a>
          `
          )
        }
  
      }
  
      var formStyle = `"
        display: flex;
        flex-direction: row;
        width: 223px;
        margin: 8px 0;
        border-radius: 5px;
        height: 42px;
        border: 1px solid `+ bgColor +`;
        text-align: center;
        font-size: 18px;
        margin: 10px auto 0px;
        padding: 1px;
      "`
  
      var inputStyle = `"
        flex-grow: 2;
        outline: none;
        border: none;
        text-align: center;
        font-size: 13px;
        width: 150px;
      "`
  
      var buttonStyle = `"
        border-color: `+ bgColor +`;
        background: #9B5AB6;
        border:1px solid;
        border-radius: 5px;
        color:white;
        cursor: pointer;
        outline: none;
        width: 55px;
        font-size: 13px;
      "`
  
      jQuery('.couponLink').click(function (evt) {
        jQuery(evt.target).replaceWith(
          `<form style=`+ formStyle +`  class="couponForm lp5701389762428928">
            <input
              style=` + inputStyle + `
              type="text" 
              placeholder="coupon code" 
              onfocus="this.placeholder = ''"
              value="`+ urlCoupon +`"
              onblur="this.placeholder = 'coupon code'"
            />
            <button class="couponButton" style=`+buttonStyle+` >apply</button>
          </form>
          <div class="couponError" style="margin-bottom: 10px; font-size: 12px; color: red;"></div>
          `)
  
        jQuery('.couponForm.lp5701389762428928').submit(function (e) {
          e.preventDefault()
          console.log('submit!', jQuery(e.target).find('input').val())
          var couponCode = jQuery(e.target).find('input').val()
  
          // Display spinner
          jQuery(".couponButton").html(
            `<div class="la-ball-spin-fade la-sm" style="margin: 0 auto">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
          `)
  
          jQuery.post(
            "https://api.launchpass.com/coupon", {
              key: "pk_live_j3AMF8zGT0vqEsyZxgxyXhst",
              sp: "5701389762428928",
              ownerId: "5965554779422720",
              couponCode: couponCode,
            },
            function (data) {
              console.log(data)
              if (data.valid) {
                  validCoupon = couponCode
                  jQuery(e.target).parent().find('.couponError').text('Coupon Applied')
                  jQuery(e.target).parent().find('.couponError').css('border-color', 'white')
                  jQuery(e.target).parent().find('.couponError').css('color', 'white')
                  jQuery('.couponForm').hide()
  
                  var quantity = data.amount_off
                      ? '$'+(data.amount_off/100) + ' off '
                      : data.percent_off + '% off '
  
                  var duration = (data.duration === 'forever' || data.duration === 'once')
                      ? data.duration === 'forever' ? 'monthly' : 'one time'
                      : 'for ' + data.duration_in_months + ' months'
  
                  couponDesc = quantity + duration
                  
                  handler.open({
                      name: "sparrow",
                      description: couponDesc,
                      panelLabel: "Start Your Trial"
                  });
  
                  
              } else {
                  jQuery(e.target).find('input').css('border-color', 'red')
                  jQuery(e.target).parent().find('.couponError').text('invalid coupon, please try again')
              }
  
              jQuery(".couponButton").html('apply')
  
            }
          );
        })
      })
  
      if (urlCoupon) jQuery('.couponLink').click()
  
      window.addEventListener('popstate', function () {
        handler.close();
      });
  
    }
  })();