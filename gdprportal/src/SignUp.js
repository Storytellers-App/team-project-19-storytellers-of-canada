import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useToasts} from "react-toast-notifications";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const submitRequest = async (username, password, email) => {
    const res = await fetch("http://radioapp.storytellers-conteurs.ca/gdpr", {
        method: "POST",
        body: JSON.stringify({username, password, email}),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (res.ok) {
        return await res.json();
    }

    throw new Error(await res.text());
};

export default function SignUp() {
    const classes = useStyles();
    const {addToast} = useToasts();

    const submitForm = async (event) => {
        event.preventDefault();
        console.log(event.target[0].value);
        console.log(event.target[2].value);
        console.log(event.target[4].value);
        submitRequest(event.target[0].value, event.target[2].value, event.target[4].value)
            .then((_) => {
                addToast(`Successfully submitted request.`, {
                    appearance: "success",
                });
            }).catch((e) => {
            addToast(`Error: ${e}. Please contact Storytellers of Canada via email.`, {appearance: "error"});
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5" align={"center"}>
                    Fill out this form to get GDPR/CCPA data sent to your email
                </Typography>
                <form className={classes.form} noValidate onSubmit={submitForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                name="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        {/*<Grid item xs={12}>*/}
                        {/*    <TextField*/}
                        {/*        variant="outlined"*/}
                        {/*        required*/}
                        {/*        fullWidth*/}
                        {/*        name="password"*/}
                        {/*        label="Password"*/}
                        {/*        type="password"*/}
                        {/*        id="password"*/}
                        {/*        */}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={12}>*/}
                        {/*    <FormControlLabel*/}
                        {/*        control={<Checkbox value="allowExtraEmails" color="primary" />}*/}
                        {/*        label="I want to receive inspiration, marketing promotions and updates via email."*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit
                    </Button>
                    {/*<Grid container justify="flex-end">*/}
                    {/*    <Grid item>*/}
                    {/*        <Link href="#" variant="body2">*/}
                    {/*            Already have an account? Sign in*/}
                    {/*        </Link>*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                </form>
            </div>
            {/*<Box mt={5}>*/}
            {/*    <Copyright />*/}
            {/*</Box>*/}
        </Container>
    );
}