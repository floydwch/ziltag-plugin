import riot from 'riot';

riot.tag('ziltag-plugin',
    `
    <button class='ziltag-login-btn'></button>
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
    }
);
