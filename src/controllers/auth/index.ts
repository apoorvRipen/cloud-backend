import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { IUser, makeResponse } from '../../lib';
import { forgotPasswordValidation, loginValidation, resetPasswordValidation } from '../../middlewares';
import { createUser, editUser, email, findUserByUuid, getUser } from '../../services';
import { assignToken, hashPassword, matchPassword } from '../../services/common';

const router = Router();

router.post('/login',
    loginValidation, async (req, res) => {
        try {
            const user: IUser | null = await getUser({ email: req.body.email, status: { $ne: 'DELETED' } });
            if (!user) {
                return makeResponse(res, 404, false, 'Please enter valid Email and Password');
            }
            if (user.status === "INACTIVE") {
                return makeResponse(res, 400, false, 'User is block by ADMIN');
            }
            const passwordCorrect = await matchPassword(req.body.password, user.password);
            if (!passwordCorrect) {
                return makeResponse(res, 400, false, 'Please enter valid Email and Password');
            }
            const token = assignToken({ name: user.firstName, email: user.contact?.email, role: user._role, _id: user._id },
                String(process.env.JWT_SECRET));

            return makeResponse(res, 200, true, 'Login successfully',
                { token, ...user, password: undefined });
        } catch (error) {
            return makeResponse(res, 400, false, 'Error');
        }
    });

router.post('/forgot-password', forgotPasswordValidation, (req, res) => {
    const uid = uuid();
    getUser(req.body, { _id: 1 })
        .then(async (user: any) => {
            if (user) {
                return createUser({ _user: user._id, uuid: uid });
            }

            throw new Error('User does not exists');

        })
        .then(async () => {
            const data = {
                to: [req.body.email],
                subject: 'Reset Password',
                content: `<div>
        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="0" width="0" id="m_4732509938397135873preheaderTable">
                <tbody><tr>
                    <td>
                        <span style="display:none">Reset Password</span>
                    </td>
                </tr>
            </tbody></table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="m_4732509938397135873bodyTable">
                <tbody><tr>
                    <td align="center" valign="top" id="m_4732509938397135873bodyCell">


                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="border:1px solid #e4e4e4">
                            <tbody><tr>
                                <td valign="top" id="m_4732509938397135873templatePreheader">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
                                        <tbody>
                                            <tr>
                                                <td valign="top">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top" style="text-align:center;padding-top:9px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:18px;font-style:normal;font-weight:bold;text-align:justify">
                                                                    <center>
                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style="border-bottom:2px solid #4390ef">
                                                                                        <h1 style="text-align:center;margin:0">
                                                                                            <span style="font-size:18px;display:inline-block">
                                                                                                <span style="font-family:arial,helvetica neue,helvetica,sans-serif;color:#000">
                                                                                                    Reset Password
                                                                                                </span>
                                                                                            </span>
                                                                                        </h1>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </center>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" id="m_4732509938397135873templateBody">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
                                        <tbody>
                                            <tr>
                                                <td valign="top">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top" style="padding-top:40px;padding-right:50px;padding-bottom:50px;padding-left:50px">
                                                                    <span style="color:#202020;font-family:helvetica;font-size:15px;line-height:24px">Hi,</span>
                                                                    <br>
                                                                    <br>
                                                                    <span style="color:#202020;font-family:helvetica;font-size:15px;line-height:24px">
                                                                        Please reset your password by clicking
                                                                        <a href="` + process.env.FORGOTPASSLINK + '/reset-password/' + uid + `">
                                                                         <strong> here <strong>
                                                                        </a>
                                                                    </span>
                                                                    <br>
                                                                    <br>
                                                                    <span style="color:#202020;font-family:helvetica;font-size:15px;line-height:24px">If you've received this email in error, it's likely that another user entered your email address by mistake while trying to reset a password.</span>
                                                                    <br>
                                                                    <br>
                                                                    <span style="color:#202020;font-family:helvetica;font-size:15px;line-height:24px">If you didn't initiate the request, you don't need to take any further action and can safely disregard this email.</span>
                                                                    <br>
                                                                    <br>
                                                                    <span style="color:#202020;font-family:helvetica;font-size:15px;line-height:24px">Regards,</span>
                                                                    <br>
                                                                    <span style="color:#202020;font-family:helvetica;font-size:15px;line-height:24px">HRM</span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody></table>
                        <table border="0" cellpadding="0" cellspacing="0" width="600">
                            <tbody><tr>
                                <td>
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
                                        <tbody>
                                            <tr>
                                                <td valign="top" style="padding-top:10px">
                                                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top" style="padding-right:0px;padding-left:0px;padding-top:0;padding-bottom:0">
<img src = "" width="100" />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody></table>


                    </td>
                </tr>
            </tbody></table>
        </center></div>`
            };

            return email({ ...data, from: process.env.SOURCE_EMAIL });
        })
        .then(async () => {
            await makeResponse(res, 200, true, 'password reset link has been sent to your mail');
        })
        .catch(async error => {
            await makeResponse(res, 400, false, error.message);
        });
});

router.put('/reset-password/:uuid', resetPasswordValidation, async (req, res) => {
    if (!req.params.uuid) {
        await makeResponse(res, 400, false, 'uuid is required');
    }
    findUserByUuid(req.params.uuid)
        .then(async (user) => {
            return editUser({ _id: user._user }, { password: await hashPassword(req.body.password) });
        })
        .then(async () => {
            await makeResponse(res, 200, true, 'password reset successful');
        })
        .catch(async (error: any) => {
            await makeResponse(res, 400, false, error.message);
        });
});

export const authController = router;
