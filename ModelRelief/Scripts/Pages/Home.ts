// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ElementClasses, ElementIds} from "Scripts/System/Html";

/**
 * @description Home Utilities
 * @class Home
 */
export class Home {

    private _submitButton: HTMLInputElement;

    /**
     * @description Contact form submission
     * @return {*}  {boolean}
     */
    public submitContactForm(): boolean {

        const name: HTMLInputElement = document.getElementById("contact-name") as HTMLInputElement;
        if (name.value === "") {
            document.getElementById("contact-form-status").innerHTML = "Please enter a Name";
            return false;
        }

        const email = document.getElementById("contact-email") as HTMLInputElement;
        if (email.value === "") {
            document.getElementById("contact-form-status").innerHTML = "Please enter your e-mail address";
            return false;
        } else {
            //eslint-disable-next-line
            const mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!email.value.match(mailformat)) {
                const statusDiv: HTMLDivElement = document.getElementById("contact-form-status") as HTMLDivElement;
                statusDiv.innerHTML = "Your e-mail address is invalid";
                return false;
            }
        }

        const subject = document.getElementById("contact-subject") as HTMLInputElement;
        if (subject.value === "") {
            document.getElementById("contact-form-status").innerHTML = "Please enter a subject";
            return false;
        }

        const message = document.getElementById("contact-message")as HTMLInputElement;
        if (message.value === "") {
            document.getElementById("contact-form-status").innerHTML = "Please enter a message";
            return false;
        }

        const reCAPTCHAResponse = grecaptcha.getResponse();
        if (reCAPTCHAResponse.length == 0) {
            document.getElementById("contact-form-status").innerHTML = "Please check 'I'm not a robot.' before sending your message.";
            return false;
        }

        const status: HTMLDivElement = document.getElementById("contact-form-status") as HTMLDivElement;
        status.innerHTML = "Sending...";

        const applications = [];
        $("#applicationDomain input:checked").each(function () {
            applications.push((this as HTMLInputElement).value);
        });

        const formData = {
            "Name": $("input[name=Name]").val(),
            "Email": $("input[name=Email]").val(),
            "Subject": $("input[name=Subject]").val(),
            "Message": $("textarea[name=Message]").val(),
            "Newsletter": $("#checkboxNewsletter").is(":checked"),

            "Applications": applications,
            "ApplicationOther": $("input[name=applicationOther]").val(),

            "ReCAPTCHAResponse": reCAPTCHAResponse
        };

        $.ajax({
            url: "Email/Send",
            type: "POST",
            data: formData,

            success: function (responseResult, textStatus, jqXHR) {

                $("#contact-form-status").html(responseResult.message);
                if (responseResult.mailSent) {
                    // reset the form if mail was sent successfully
                    $("#contact-form").closest("form").find("input[type=text], textarea").val("");
                    $("#contact-form").closest("form").find("input[type=checkbox]").prop("checked", false);
                    grecaptcha.reset();
                    return true;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#contact-form-status").html(jqXHR.statusText);
                return false;
            },
        });
    }

    /**
     * @description Initialize the UI controls..
    */
    private initializeControls(): void {

        // Contact Form
        this._submitButton = document.getElementById(ElementIds.SubmitContactForm) as HTMLInputElement;
        this._submitButton.addEventListener("click", () => {
            this.submitContactForm();
        });
    }

    /**
     * @description Main
     */
    public main(): void {
        // UI Controls
        this.initializeControls();
    }
}

const home = new Home();
home.main();
