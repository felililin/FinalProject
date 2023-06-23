//Banner's function
$(window).ready(function () {
    $.ajax({
        url: "/api/banner",

    }).done(function (banners) {
        var html = '';

        banners.forEach((banner) => {
            console.log(banner.image_url)
            html += '<img src="' + banner.image_url + '" />'
        })

        html += '<div class="buttons">' +
            '<div class="prev"></div>' +
            '<div class="next"></div>' +
            '</div>';

        $("#banners").html(html)
        $("#banners img").first().addClass("shown")

        new Slider({
            images: '.slider-1 img',
            btnPrev: '.slider-1 .buttons .prev',
            btnNext: '.slider-1 .buttons .next',
            auto: true,
            rate: 10000
        });
    });

    globalUser = JSON.parse(localStorage.getItem('user'));
    if (!!globalUser) {
        logout.style.display = "block";
    } else {
        logout.style.display = "none";
    }
});

// Get the modal
var modal = document.getElementById("myModal");

var loginAcc = document.getElementById("account");

var logout = document.getElementById("logout");

var span = document.getElementsByClassName("close")[0];
let globalUser = localStorage.getItem('user')

loginAcc.onclick = function () {
    if (!!globalUser) {
        window.location.href = "account"
        return;
    }
    modal.style.display = "block";
}

$("#cart").click(() => {
    if (!!globalUser) {
        window.location.href = "cart"
        return;
    }
    modal.style.display = "block";
})

$("#registerLink").click(() => {
    $("#myModal").hide()
    $("#registerModal").show()
})

$("#loginLink").click(() => {
    $("#myModal").show()
    $("#registerModal").hide()
})

$("#registerClose").click(() => {
    $("#registerModal").hide()
})

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (e) {
    if (e.target == modal) {
        modal.style.display = "none";
    } else if (e.target.id == "registerModal") {
        $("#registerModal").hide()
    }
}

logout.onclick = function (e) {
    localStorage.removeItem("user");
    location.href = "/"
}

//login's function
$("#loginForm").submit((e) => {
    e.preventDefault()
    var email = $("#exampleInputEmail").val();
    var pass = $("#exampleInputPassword").val();
    if (email != "" && pass != "") {
        $("#loading_spinner").css({ "display": "block" });
        $.ajax
            ({
                type: 'post',
                url: 'api/user/login',
                data: {
                    email: email,
                    password: pass
                },
                success: function (response) {
                    if (response.is_success) {
                        globalUser = response.user;
                        localStorage.setItem('user', JSON.stringify(response.user));
                        modal.style.display = "none";
                        logout.style.display = "block";
                        location.reload()
                    } else {
                        alert(response.error_message)
                    }
                }
            });
    }
})

$("#registerForm").submit((e) => {
    e.preventDefault()
    const email = $("#registerEmail").val();
    const pass = $("#registerPassword").val();
    const firstName = $("#registerFirstName").val();
    const lastName = $("#registerLastName").val();

    if (email != "" && pass != "" && (firstName != "" || lastName != "")) {
        $("#loading_spinner").css({ "display": "block" });
        $.ajax
            ({
                type: 'post',
                url: 'api/user/register',
                data: {
                    email: email,
                    password: pass,
                    first_name: firstName,
                    last_name: lastName
                },
                success: function (response) {
                    if (response.is_success) {
                        globalUser = response.user;
                        localStorage.setItem('user', JSON.stringify(response.user));
                        $("#registerModal").hide()
                        logout.style.display = "block";
                        location.reload()
                    } else {
                        alert(response.error_message)
                    }
                }
            });
    }
})