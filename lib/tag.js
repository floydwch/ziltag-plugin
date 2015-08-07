import riot from 'riot';

riot.tag('ziltag-plugin',
    `
    <button onclick={show_login_form} class='ziltag-login-btn'></button>
    <form class='ziltag-login-form'>
        <div class='ziltag-login-form-board'>
            <input type='text' name='email' placeholder='Email 信箱' class='ziltag-login-form-email'>
            <hr>
            <input type='password' name='password' placeholder='密碼' class='ziltag-login-form-password'>
        </div>
        <br>
        <input type='submit' value='登入' class='ziltag-login-form-submit'>
    </form>
    `,
    function(opts) {
        this.show_login_form = (e) => {
            let form = document.getElementsByClassName('ziltag-login-form')[0];
            form.classList.add('ziltag-login-form-active');
            e.stopPropagation();
        };

        document.addEventListener('click', (e) => {
            let target = e.target;
            let form = document.getElementsByClassName('ziltag-login-form')[0];
            let click_on_form = false;

            if(target.classList.contains('ziltag-login-form')) {
                click_on_form = true;
            } else if(form.contains(target)) {
                click_on_form = true;
            }

            if(!click_on_form) {
                form.classList.remove('ziltag-login-form-active');
            }
        });
    }
);
