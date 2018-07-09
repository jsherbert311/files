jQuery(document).ready(function() {
    cfaq_initFaqs()
});

function cfaq_initFaqs() {
    jQuery.each(cfaq_faqs.faqs, function() {
        var a = this;
        a.plannedSteps = new Array();
        a.lastSteps = new Array();
        a.currentStep = 0;
        a.canAnswer = true;
        a.firstStep = 0;
        a.firstStep = jQuery('#clever_faq[data-faqid="' + a.id + '"] .cfaq_step[data-start="1"]').attr("data-stepid");
        if (cfaq_faqs.calledStep > 0) {
            jQuery('#clever_faq[data-faqid="' + a.id + '"] .cfaq_step[data-start="1"]').hide();
            cfaq_openStep(cfaq_faqs.calledStep, a.id)
        } else {
            if (a.firstStep > 0) {
                cfaq_openStep(a.firstStep, a.id)
            }
        }
    })
}

function cfaq_answerClicked(g) {
    var b = jQuery(g);
    b.addClass("checked");
    var a = b.closest("#clever_faq").attr("data-faqid");
    var f = b.closest(".clever_step");
    var e = cfaq_getFaqByID(a);
    var d = false;
    if (e.canAnswer) {
        e.canAnswer = false;
        setTimeout(function() {
            e.canAnswer = true
        }, 450);
        e.lastSteps.push(parseInt(e.currentStep));
        var c = cfaq_findPotentialsSteps(e.currentStep, a);
        if (c == "final") {
            c = e.firstStep;
            d = true
        }
        if (c) {
            setTimeout(function() {
                if (d) {
                    cfaq_restart(a)
                } else {
                    cfaq_openStep(c, a)
                }
            }, 350)
        }
    }
}

function cfaq_noQuestionClicked(b) {
    var d = cfaq_getFaqByID(b);
    var a = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step[data-stepid="' + d.currentStep + '"]');
    var c = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_contactStep');
    c.slideDown()
}

function cfaq_getFaqByID(a) {
    var b = false;
    jQuery.each(cfaq_faqs.faqs, function() {
        if (this.id == a) {
            b = this
        }
    });
    return b
}

function cfaq_previousStepClicked(b) {
    var c = cfaq_getFaqByID(b);
    var a = false;
    var e = 0;
    var d = 0;
    jQuery.each(c.lastSteps, function(f) {
        var g = parseInt(this);
        if (parseInt(g) == parseInt(c.lastSteps[c.lastSteps.length - 1])) {
            a = true;
            e = g;
            d = f
        }
    });
    c.lastSteps.pop();
    if (e > 0) {
        cfaq_openStep(e, b)
    } else {
        cfaq_restart(b)
    }
}

function cfaq_openStep(f, b) {
    var e = cfaq_getFaqByID(b);
    var d = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step[data-stepid="' + f + '"]');
    d.find(".cfaq_answers li a").removeClass("checked");
    if (e.lastSteps.length > 0) {
        d.find("li.cfaq_previousStep").show()
    } else {
        d.find("li.cfaq_previousStep").hide()
    }
    var a = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step[data-stepid="' + e.currentStep + '"]');
    a.slideUp();
    e.currentStep = f;
    jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_contactStep').slideUp();
    d.slideDown();
    jQuery("body,html").animate({
        scrollTop: jQuery('#clever_faq[data-faqid="' + b + '"]').offset().top - 40
    }, 200);
    if (d.find(".cfaq_answers > li:not(.cfaq_noQuestion):not(.cfaq_restartFaq)").length == 1) {
        d.find(".cfaq_answers > li:not(.cfaq_noQuestion):not(.cfaq_restartFaq)").addClass("checked");
        var c = cfaq_findPotentialsSteps(e.currentStep, b);
        if (c == "final") {
            d.find(".cfaq_restartFaq").hide()
        }
        d.find(".cfaq_answers > li:not(.cfaq_noQuestion):not(.cfaq_restartFaq)").removeClass("checked")
    }
}

function cfaq_restart(b) {
    var c = cfaq_getFaqByID(b);
    var a = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step[data-stepid="' + c.currentStep + '"]');
    a.slideUp();
    c.plannedSteps = new Array();
    c.lastSteps = new Array();
    c.currentStep = 0;
    jQuery('#clever_faq[data-faqid="' + b + '"] li>a.checked').removeClass("checked");
    jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_finalText').fadeOut();
    jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_restartFaq').show();
    c.firstStep = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step[data-start="1"]').attr("data-stepid");
    cfaq_openStep(jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step[data-start="1"]').attr("data-stepid"), b)
}

function cfaq_findPotentialsSteps(f, b) {
    var c = cfaq_getFaqByID(b);
    var d = new Array();
    var a = new Array();
    var e = new Array();
    var g = 0;
    jQuery.each(c.links, function() {
        var j = this;
        if (j.originID == f) {
            var i = false;
            var h = true;
            if (j.conditions && j.conditions != "[]") {
                j.conditionsO = JSON.parse(j.conditions);
                var k = cfaq_checkConditions(j.conditionsO, b);
                i = k.error;
                h = k.errorOR
            } else {
                e.push(j.destinationID)
            }
            if ((j.operator == "OR" && !h) || (j.operator != "OR" && !i)) {
                j.conditionsO = JSON.parse(j.conditions);
                a.push({
                    stepID: parseInt(j.destinationID),
                    nbConditions: j.conditionsO.length
                });
                if (j.conditionsO.length > g) {
                    g = j.conditionsO.length
                }
                d.push(parseInt(j.destinationID))
            }
        }
    });
    if (f == 0) {
        d.push(parseInt(jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step[data-start="1"]').attr("data-stepid")))
    }
    if (d.length == 0) {
        d.push("final")
    } else {
        if (e.length > 0 && e.length < d.length) {
            jQuery.each(e, function() {
                var h = this;
                d = jQuery.grep(d, function(i) {
                    return i != h
                })
            });
            if (g > 0) {
                jQuery.each(d, function(h) {
                    jQuery.each(a, function(i) {
                        if (i.stepID == h && i.nbConditions < g) {
                            d = jQuery.grep(d, function(j) {
                                return j != h
                            })
                        }
                    })
                })
            }
        }
    }
    return d
}

function cfaq_checkConditions(d, b) {
    var c = false;
    var a = true;
    jQuery.each(d, function() {
        var h = this;
        if (h.interaction.substr(0, 1) != "_") {
            var g = h.interaction.substr(0, h.interaction.indexOf("_"));
            var f = h.interaction.substr(h.interaction.indexOf("_") + 1, h.interaction.length);
            var e = jQuery('#clever_faq[data-faqid="' + b + '"] [data-itemid="' + f + '"]');
            switch (h.action) {
                case "clicked":
                    if (!e.is(".checked")) {
                        c = true
                    }
                    if (e.is(".checked")) {
                        a = false
                    }
                    break;
                case "unclicked":
                    if (e.is(".checked")) {
                        c = true
                    }
                    if (!e.is(".checked")) {
                        a = false
                    }
                    break
            }
        }
    });
    return {
        error: c,
        errorOR: a
    }
}

function cfaq_sendQuestion(b) {
    var d = cfaq_getFaqByID(b);
    var e = false;
    var c = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_contactStep').find('textarea[name="question"]');
    var a = jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_contactStep').find('input[name="email"]');
    c.removeClass("cfaq_error");
    a.removeClass("cfaq_error");
    if (c.val().length < 3) {
        e = true;
        c.addClass("cfaq_error")
    }
    if (!cfaq_checkEmail(a.val())) {
        e = true;
        a.addClass("cfaq_error")
    }
    if (!e) {
        jQuery.ajax({
            url: "/wp-content/plugins/simulator/send.php",
            type: "post",
            data: {
                question: c.val(),
                email: a.val(),
                faqID: b
            },
            success: function() {
                c.val("");
                jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_step').slideUp();
                jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_contactStep').slideUp();
                setTimeout(function() {
                    jQuery('#clever_faq[data-faqid="' + b + '"] .cfaq_finalText').fadeIn();
                    setTimeout(function() {
                        cfaq_restart(b)
                    }, d.resetDelay * 1000)
                }, 400)
            }
        })
    }
}

function cfaq_checkEmail(a) {
    if (a.indexOf("@") != "-1" && a.indexOf(".") != "-1" && a != "") {
        return true
    }
    return false
}

function cfaq_closeContactStep(a) {
    jQuery('#clever_faq[data-faqid="' + a + '"] .cfaq_contactStep').slideUp();
    jQuery("body,html").animate({
        scrollTop: jQuery('#clever_faq[data-faqid="' + a + '"]').offset().top - 40
    }, 200)
}

function cfaq_restartFaqClicked(a) {
    var b = cfaq_getFaqByID(a);
    jQuery('#clever_faq[data-faqid="' + a + '"] .cfaq_step').slideUp();
    jQuery('#clever_faq[data-faqid="' + a + '"] .cfaq_contactStep').slideUp();
    cfaq_restart(a)
};

var cfaq_faqs = {
    "faqs": [{
        "id": "1",
        "title": "Walkthrough",
        "colorA": "#f1f2f8",
        "colorB": "#15416e",
        "colorC": "#FFFFFF",
        "colorD": "#15416e",
        "colorE": "#15416e",
        "colorF": "#FFFFFF",
        "colorG": "#15416e",
        "colorH": "#ffffff",
        "colorBg": "",
        "colorFields": "#15416e",
        "colorFieldsBg": "#FFFFFF",
        "colorFieldsFocus": "#18ba60",
        "colorFieldsBorder": "#bdc3c7",
        "colorBtn": "#15416e",
        "colorBtnBg": "#18ba60",
        "colorLabels": "#15416e",
        "colorRestartBg": "#bdc3c7",
        "colorRestart": "#ecf0f1",
        "customCss": "",
        "useGoogleFont": "0",
        "googleFontName": "Lato",
        "loadAllPages": "1",
        "txtNoQuestion": "Question or comment?",
        "txtNewQuestion": "Your request was correctly sent. We will reply as soon as possible. Thank you !",
        "txtReturnStart": "START OVER",
        "txtPreviousStep": "GO BACK",
        "labelQuestion": "What are we missing?",
        "labelEmail": "Your Email",
        "labelSend": "SEND",
        "email": "info@superiortradelines.com",
        "emailSubject": "New question from the credit walk-through.",
        "sendEmail": "1",
        "resetDelay": "5",
        "titlesTag": "h2",
        "steps": [{
            "id": "1",
            "faqID": "1",
            "title": "Don't buy tradelines until you've gone through this simulator!",
            "content": "{\"start\":1,\"previewPosX\":\"0\",\"previewPosY\":\"324\",\"actions\":[],\"id\":1}",
            "description": "<p>Wondering if tradelines are right for you or if you're being lied to&nbsp;by someone?&nbsp;Well, you can find out by using the interactive, scenario-based, tool below.<br><\/p>",
            "question": "Is this for your social security number or another number?",
            "start": "1"
        }, {
            "id": "2",
            "faqID": "1",
            "title": "Nice, having a credit goal is key!",
            "content": "{\"start\":\"0\",\"previewPosX\":\"0\",\"previewPosY\":\"8\",\"actions\":[],\"id\":2}",
            "description": "Having a credit goal is, in fact, key.&nbsp;But, you should&nbsp;understand: Adding tradelines will increase your credit score, but&nbsp;credit scores&nbsp;are only one&nbsp;part of an overall application for credit (such as mortgages, business loans, etc.). So, let's figure out if tradelines are right for you and your goal given some other&nbsp;factors that might stand in your way.",
            "question": "Do you have any of the following in your credit report?",
            "start": "0"
        }, {
            "id": "3",
            "faqID": "1",
            "title": "Tax liens and\/or Judgments are show stoppers...",
            "content": "{\"start\":\"0\",\"previewPosX\":\"624\",\"previewPosY\":\"211\",\"actions\":[],\"id\":3}",
            "description": "\n\n<span style='margin: 0px; font-family: \"Arial\",sans-serif;'><p style=\"margin: 0px 0px 11px;\">...but, let's\ndiscuss a bit further. We know of no lender who will underwrite a mortgage for\nyou if you have tax lien or defaulted federal loans (like student loans).\nHowever, as a condition of approval, they may require that you roll the\ndefaulted amounts or tax lien balance into the loan. <\/p><p style=\"margin: 0px 0px 11px;\"><span style='margin: 0px; font-family: \"Arial\",sans-serif;'>Judgments may or may not stop the mortgage process. Underwriters may approve your loan if the payment of the judgment is satisfied at the time of closing. Also, an older, paid off judgment may not be an issue for underwriting, but it may bring down your score. Tradelines may help overcome that score issue. <\/span><\/p><p style=\"margin: 0px 0px 11px;\">So, if depending on the\ncondition of those issues, you may be able to proceed. <\/p><\/span>\n\n",
            "question": "What do you plan to do with these Tax liens and\/or Judgment.",
            "start": "0"
        }, {
            "id": "6",
            "faqID": "1",
            "title": "Credit repair and settlment is a good option",
            "content": "{\"start\":\"0\",\"previewPosX\":\"614\",\"previewPosY\":\"380\",\"actions\":[],\"id\":6}",
            "description": "<p>If you plan to clear up your negative items through credit repair, that can help. However,&nbsp;if you are not successful, tradelines will not work and you will be in further debt with no positive result. So, if you continue, please keep in mind that our continued answers assume that you're&nbsp;going to be successful in your credit repair efforts. <\/p><p>Also, if you need a skilled professional to help you, please call us at 800-431-4741 or email us at info@superiortradelines.com<br><\/p>",
            "question": "Keep going?",
            "start": "0"
        }, {
            "id": "8",
            "faqID": "1",
            "title": "Let's talk balances...",
            "content": "{\"start\":\"0\",\"previewPosX\":\"1480\",\"previewPosY\":\"0\",\"actions\":[],\"id\":8}",
            "description": "<p>Assuming you have no collections,&nbsp;charge-offs, or other significant negative items&nbsp;(or that you've paid or promised to pay them off - or otherwise take care of them&nbsp;-&nbsp;prior to adding tradelines), the next thing&nbsp;to factor to determine is your overall debt to credit ratio. I.e., what is your&nbsp;overall utilization of credit? The utilization is your total balances divided by your total limits on your credit cards. <br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "10",
            "faqID": "1",
            "title": "Anything else?",
            "content": "{\"start\":\"0\",\"previewPosX\":\"1296\",\"previewPosY\":\"85\",\"actions\":[],\"id\":10}",
            "description": "Some negative information won't stop tradelines from working. So, you can continue, here. While we understand that talking about the negative information can be annoying, we need to know so that we can give you an accurate recommendation.",
            "question": "Do you have any other negative items?",
            "start": "0"
        }, {
            "id": "11",
            "faqID": "1",
            "title": "Tradelines aren't the best option :(",
            "content": "{\"start\":\"0\",\"previewPosX\":\"269\",\"previewPosY\":\"452\",\"actions\":[],\"id\":11}",
            "description": "<p>So, here's the deal: Certain negative information can prevent tradelines from working. For example:<\/p><ul><li>&nbsp;Discharged bankruptcies within the past 24 months. <\/li><li>&nbsp;Dismissed bankruptcies within the past 24 months.<\/li><li>&nbsp;Recent (within 6 months) late payments.<\/li><li>&nbsp;Unpaid charge-off and collections.<br><\/li><\/ul><p>So, since it appears some of these negative items are in your credit report (according to your answers, so far), we recommend that you <b><i>do not<\/i><\/b> move forward with tradelines. <\/p><p>We can recommend a professional that can help you&nbsp;in your efforts to resolve these issues. Call us at 800-431-4741 or email us at info@superiortradelines.com and we will connect you with a skilled professional that can help.<br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "12",
            "faqID": "1",
            "title": "Late payments can be problematic.",
            "content": "{\"start\":\"0\",\"previewPosX\":\"620\",\"previewPosY\":\"72\",\"actions\":[],\"id\":12}",
            "description": "Depending on the timing of the late payments, tradelines may or may not work. So, let's break it down in to two simple parts.",
            "question": "When was the last late payment?",
            "start": "0"
        }, {
            "id": "15",
            "faqID": "1",
            "title": "Charge offs and\/or Collections are complicated.",
            "content": "{\"start\":\"0\",\"previewPosX\":\"614\",\"previewPosY\":\"540\",\"actions\":[],\"id\":15}",
            "description": "<p>Depending on many factors (such as whether the account is paid off, actively and recently reporting, etc.), charge-off and collection accounts can prevent tradelines from increasing your credit score. <\/p><p><br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "17",
            "faqID": "1",
            "title": "Backruptcies are a double-edged sword.",
            "content": "{\"start\":\"0\",\"previewPosX\":\"621\",\"previewPosY\":\"696\",\"actions\":[],\"id\":17}",
            "description": "\"Bankruptcy\" by itself sounds bad, but in reality, it's a much more fluid topic and requires more consideration. For example, whether the bankruptcy was dismissed or discharged results in&nbsp;a different impact on your credit. Also, how long ago the bankruptcy occurred also determines how it affects your credit report and score.",
            "question": "Was your bankruptcy dismissed or discharged?",
            "start": "0"
        }, {
            "id": "18",
            "faqID": "1",
            "title": "A discharged bankruptcy?",
            "content": "{\"start\":\"0\",\"previewPosX\":\"799\",\"previewPosY\":\"702\",\"actions\":[],\"id\":18}",
            "description": "Well, this is good news... depending on a few things. First, if the bankruptcy was discharged less than 2 years ago (or 1 year ago, in some cases), the possibility of obtain lending is drastically reduced. This is especially true for mortgages. The good news, however, is that a discharged bankruptcy literally erases bad debt. ",
            "question": "When was the bankruptcy discharged?",
            "start": "0"
        }, {
            "id": "19",
            "faqID": "1",
            "title": "A dismissed bankrupcy?",
            "content": "{\"start\":0,\"previewPosX\":\"762\",\"previewPosY\":\"936\",\"actions\":[],\"id\":18}",
            "description": "<p>Dismissed bankruptcies are a double-edged sword. On the one hand, you did not fully declare bankruptcy. On the other hand, the debt which you intended to discharge remains, including any derogatory history associated with it. Our recommendation will change depending on how recently your bankruptcy was dismissed.<br><\/p>",
            "question": "When was the bankruptcy discharged?",
            "start": "0"
        }, {
            "id": "24",
            "faqID": "1",
            "title": "Let's talk...",
            "content": "{\"start\":\"0\",\"previewPosX\":\"822\",\"previewPosY\":\"514\",\"actions\":[],\"id\":24}",
            "description": "<p>A discharged bankruptcy more than 2 years ago may mean you're in the clear. However, this isn't always the case (even though it should be), because creditors and the credit bureaus may not do the right thing. So, a credit report analysis required and you would be best served by getting on the phone with us.<\/p><p>Please call 800-431-4741 (or email info@superiortradelines.com) for a free credit report analysis and consultation.<br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "26",
            "faqID": "1",
            "title": "Good work on your balances!",
            "content": "{\"start\":\"0\",\"previewPosX\":\"1973\",\"previewPosY\":\"0\",\"actions\":[],\"id\":26}",
            "description": "So,&nbsp;keeping balances below 30%&nbsp;is a qualifying factor to add tradelines. Great work! We have only one more thing to consider; average age of accounts.",
            "question": "Ready for the last step?",
            "start": "0"
        }, {
            "id": "27",
            "faqID": "1",
            "title": "You're in a \"maybe\" category...",
            "content": "{\"start\":\"0\",\"previewPosX\":\"1719\",\"previewPosY\":\"117\",\"actions\":[],\"id\":27}",
            "description": "<p>Balances should be below 30%. However, this isn't the end of the world.&nbsp;For example,&nbsp;if you could pay down your balances for $100.00, then who cares, right?&nbsp;But, if your&nbsp;balances are&nbsp;thousands of dollars, that's a different story. Bottom line, this category of credit reports needs further analysis.&nbsp; We can help with that.<\/p><p>Call us at 800-431-4741 or email at info@superiortradelines.com<\/p>",
            "question": "Can you pay down your balances below 30% prior to adding tradelines?",
            "start": "0"
        }, {
            "id": "28",
            "faqID": "1",
            "title": "Average age of accounts...",
            "content": "{\"start\":\"0\",\"previewPosX\":\"2222\",\"previewPosY\":\"0\",\"actions\":[],\"id\":28}",
            "description": "<p>\"Average age of accounts\" means, literally, how old your open and active accounts are... on average. So, for example, suppose you have one 2 year old credit card and one 10 year old credit card. Your average age of accounts would be 6 years (10 years&nbsp;+ 2 years&nbsp;\/ 2 accounts&nbsp;= 6 years of age, on average). <\/p><p>This is an important factor and we can help you do the calculation if you call 800-431-4741 or email us at info@superiortradelines.com<br><\/p>",
            "question": "Is your average age of accounts above two (2) years?",
            "start": "0"
        }, {
            "id": "29",
            "faqID": "1",
            "title": "This may be a problem, but... ",
            "content": "{\"start\":\"0\",\"previewPosX\":\"1714\",\"previewPosY\":\"472\",\"actions\":[],\"id\":29}",
            "description": "<p>Balances at 90% or above certainly isn't a good thing and it can prevent the tradelines from working. However, there's more to consider. For example, are you maxed out&nbsp;($90.00 on a single $100.00 limit credit card)? If so, you can easily pay this down. <\/p><p>If you have tens of thousands of dollars of&nbsp;debt which you cannot pay down below 30%, tradelines may not have the impact for which you're hoping.<\/p>",
            "question": "Can you pay down your balances to get them out of the \"maxed out\" category?",
            "start": "0"
        }, {
            "id": "30",
            "faqID": "1",
            "title": "Good stuff! Here's what we think:",
            "content": "{\"start\":\"0\",\"previewPosX\":\"2365\",\"previewPosY\":\"146\",\"actions\":[],\"id\":30}",
            "description": "<p>If you're on this page, it means you do not have substantial or recent negative items like collections, charge-offs, defaulted loans, etc. Or, if you did\/do, you have\/will take care of those issues prior to adding tradelines. <\/p><p>Also, you mentioned that your average age of accounts is more than two years. <\/p><p>Together, this means you're highly qualified for tradelines. Also, it means you're qualified for higher limit and more aged tradelines.<\/p><p>This is what we call a \"prime position to buy.\"<\/p><p>You should absolutely move forward and give us a call at 800-431-4741 or email at info@superiortradelines.com<\/p><p>Also, you can <a href=\"https:\/\/superiortradelines.com\/start\/\">get started by clicking here<\/a>.<br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "33",
            "faqID": "1",
            "title": "\"Tradeline lists\" are not a goal.",
            "content": "{\"start\":\"0\",\"previewPosX\":\"163\",\"previewPosY\":\"596\",\"actions\":[],\"id\":33}",
            "description": "<p>If someone is offering you a tradeline \"list,\" this literally means they are placing their sales goals above your credit goals. <\/p><p>We've written a blog post&nbsp;about tradelines lists, which provides, in part:<\/p><p><b><i>\"...If you pick from a tradeline list based on price alone, you could be setting yourself up for failure...The same concept applies to picking from a list of tradelines based on the age of the account...if you pick a line of credit with the incorrect (whether it be too large or too littie) limit, you can actually damage your credit score...\"<\/i><\/b><\/p><p>So, we don't provide \"lists\" to our clients, because we think it will do more harm than good. We'd prefer you focus on goals, rather than lists.<b><i><br><\/i><\/b><br><\/p>",
            "question": "What say you?",
            "start": "0"
        }, {
            "id": "34",
            "faqID": "1",
            "title": "I don't think we're a match :(",
            "content": "{\"start\":\"0\",\"previewPosX\":\"316\",\"previewPosY\":\"596\",\"actions\":[],\"id\":34}",
            "description": "<p>So far, it seems we're not philosophically aligned. It appears&nbsp;that working together is not the best option, for either of us. However, if - in the future - you become more goal oriented, please do not hesitate to reach back out. <br><\/p><p>Good luck!<br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "35",
            "faqID": "1",
            "title": "This simulation cannot go any further :(",
            "content": "{\"start\":\"0\",\"previewPosX\":\"1716\",\"previewPosY\":\"293\",\"actions\":[],\"id\":35}",
            "description": "<p>Because the details of your balances is unknown and the details of your balances is required to make a recommendation, the simulation will provide an incomplete recommendation.<\/p><p>The only way to get an accurate answer is to have a human review your credit report. So, please contact us at 800-431-4741 or info@superiortradelines.com (or reach out to one of the experts listed below, directly).<br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "36",
            "faqID": "1",
            "title": "My Step",
            "content": "{\"start\":\"0\",\"previewPosX\":\"1787\",\"previewPosY\":\"706\",\"actions\":[],\"id\":36}",
            "description": "",
            "question": "",
            "start": "0"
        }, {
            "id": "37",
            "faqID": "1",
            "title": "Good stuff! Here's what we think...",
            "content": "{\"start\":0,\"previewPosX\":\"2359\",\"previewPosY\":\"292\",\"actions\":[],\"id\":30}",
            "description": "<p>If you're on this page, it means you do not have substantial or recent negative items like collections, charge-offs, defaulted loans, etc. Or, if you did\/do, you have\/will take care of those issues prior to adding tradelines. <\/p><p>Also, you mentioned that your average age of accounts is less than two years. <\/p><p>Together, this means you're highly qualified for tradelines. Also, it means you're qualified for higher limit and more aged tradelines.<\/p><p>This is what we call a \"prime position to buy.\"<\/p><p>You should absolutely move forward and give us a call at 800-431-4741 or email at info@superiortradelines.com<\/p><p>Also, you can <a href=\"https:\/\/superiortradelines.com\/start\/\">get started by clicking here<\/a>.<br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "38",
            "faqID": "1",
            "title": "Credit goals first!",
            "content": "{\"start\":0,\"previewPosX\":\"165\",\"previewPosY\":\"326\",\"actions\":[],\"id\":1}",
            "description": "<p>Let's start with your credit goal. This will help shape the outcome of our recommendation.<br><\/p>",
            "question": "What is your credit goal?",
            "start": "0"
        }, {
            "id": "39",
            "faqID": "1",
            "title": "You can't \"piggyback\" on business credit :(",
            "content": "{\"start\":\"0\",\"previewPosX\":\"70\",\"previewPosY\":\"476\",\"actions\":[],\"id\":39}",
            "description": "Despite what some may say, there's no such thing as \"seasoned tradelines\" or \"authorized user tradelines\" for business credit. It just doesn't exist. The only thing you can do is add tradelines to a personal social security number. Then, with an increased credit score, you can personally guarantee a business line of credit. ",
            "question": "What do you want to do?",
            "start": "0"
        }, {
            "id": "40",
            "faqID": "1",
            "title": "Good luck!",
            "content": "{\"start\":\"0\",\"previewPosX\":\"71\",\"previewPosY\":\"708\",\"actions\":[],\"id\":40}",
            "description": "I am sure there is something out there that may help, but consider this. We make money selling tradelines. If it were possible to apply tradeline concepts to business loans, we'd probably be doing it. Nevertheless, good luck with your endeavors!",
            "question": "",
            "start": "0"
        }, {
            "id": "41",
            "faqID": "1",
            "title": "We can't help you if you have a CPN :(",
            "content": "{\"start\":\"0\",\"previewPosX\":\"0\",\"previewPosY\":\"853\",\"actions\":[],\"id\":41}",
            "description": "<p>We've written many times about CPNs, but people don't like our answer :( CPNs are literally illegal and we will not work with someone who has a CPN. For example: <\/p><p>\" Robert Feldt, a Special Agent-in-Charge of the Social Security Administration (SSA) Office of the Inspector General\u2019s (OIG) Dallas Field Division (FD) said \u201cDespite what many of these credit repair Websites imply, consumers should know that CPNs are not legal.\" (<a href=\"https:\/\/superiortradelines.com\/cpns\/new-law-stops-credit-profile-numbers\/\">Source<\/a>)<\/p><p><br><\/p>",
            "question": "",
            "start": "0"
        }, {
            "id": "42",
            "faqID": "1",
            "title": "Sorry, we still can't help you :(",
            "content": "{\"start\":\"0\",\"previewPosX\":\"195\",\"previewPosY\":\"852\",\"actions\":[],\"id\":42}",
            "description": "If you have a CPN, we cannot work with your SSN, because&nbsp;the multiple numbers will&nbsp;eventually be merged and that's when the fraud alert fireworks begin. This can harm our card holders and other clients.",
            "question": "",
            "start": "0"
        }],
        "links": [{
            "id": "1999",
            "faqID": "1",
            "originID": "1",
            "destinationID": "1",
            "conditions": "[]",
            "operator": ""
        }, {
            "id": "2000",
            "faqID": "1",
            "originID": "2",
            "destinationID": "3",
            "conditions": "[{\"interaction\":\"2_4\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2001",
            "faqID": "1",
            "originID": "3",
            "destinationID": "6",
            "conditions": "[{\"interaction\":\"3_17\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2002",
            "faqID": "1",
            "originID": "3",
            "destinationID": "10",
            "conditions": "[{\"interaction\":\"3_15\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2003",
            "faqID": "1",
            "originID": "3",
            "destinationID": "11",
            "conditions": "[{\"interaction\":\"3_16\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2004",
            "faqID": "1",
            "originID": "6",
            "destinationID": "10",
            "conditions": "[{\"interaction\":\"6_18\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2005",
            "faqID": "1",
            "originID": "2",
            "destinationID": "12",
            "conditions": "[{\"interaction\":\"2_7\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2006",
            "faqID": "1",
            "originID": "12",
            "destinationID": "11",
            "conditions": "[{\"interaction\":\"12_27\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2007",
            "faqID": "1",
            "originID": "12",
            "destinationID": "10",
            "conditions": "[{\"interaction\":\"12_28\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2008",
            "faqID": "1",
            "originID": "2",
            "destinationID": "15",
            "conditions": "[{\"interaction\":\"2_24\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2009",
            "faqID": "1",
            "originID": "15",
            "destinationID": "11",
            "conditions": "[{\"interaction\":\"15_30\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2010",
            "faqID": "1",
            "originID": "15",
            "destinationID": "6",
            "conditions": "[{\"interaction\":\"15_31\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2011",
            "faqID": "1",
            "originID": "10",
            "destinationID": "8",
            "conditions": "[{\"interaction\":\"10_26\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2012",
            "faqID": "1",
            "originID": "10",
            "destinationID": "15",
            "conditions": "[{\"interaction\":\"10_37\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2013",
            "faqID": "1",
            "originID": "15",
            "destinationID": "10",
            "conditions": "[{\"interaction\":\"15_29\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2014",
            "faqID": "1",
            "originID": "10",
            "destinationID": "3",
            "conditions": "[{\"interaction\":\"10_36\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2015",
            "faqID": "1",
            "originID": "10",
            "destinationID": "12",
            "conditions": "[{\"interaction\":\"10_25\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2016",
            "faqID": "1",
            "originID": "2",
            "destinationID": "17",
            "conditions": "[{\"interaction\":\"2_40\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2017",
            "faqID": "1",
            "originID": "17",
            "destinationID": "18",
            "conditions": "[{\"interaction\":\"17_39\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2018",
            "faqID": "1",
            "originID": "17",
            "destinationID": "19",
            "conditions": "[{\"interaction\":\"17_38\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2019",
            "faqID": "1",
            "originID": "19",
            "destinationID": "11",
            "conditions": "[{\"interaction\":\"19_43\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2020",
            "faqID": "1",
            "originID": "18",
            "destinationID": "11",
            "conditions": "[{\"interaction\":\"18_41\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2021",
            "faqID": "1",
            "originID": "18",
            "destinationID": "24",
            "conditions": "[{\"interaction\":\"18_42\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2022",
            "faqID": "1",
            "originID": "19",
            "destinationID": "10",
            "conditions": "[{\"interaction\":\"19_44\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2023",
            "faqID": "1",
            "originID": "2",
            "destinationID": "8",
            "conditions": "[{\"interaction\":\"2_6\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2024",
            "faqID": "1",
            "originID": "8",
            "destinationID": "26",
            "conditions": "[{\"interaction\":\"8_21\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2025",
            "faqID": "1",
            "originID": "26",
            "destinationID": "28",
            "conditions": "[{\"interaction\":\"26_50\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2026",
            "faqID": "1",
            "originID": "8",
            "destinationID": "27",
            "conditions": "[{\"interaction\":\"8_22\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2027",
            "faqID": "1",
            "originID": "33",
            "destinationID": "34",
            "conditions": "[{\"interaction\":\"33_54\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2028",
            "faqID": "1",
            "originID": "8",
            "destinationID": "29",
            "conditions": "[]",
            "operator": ""
        }, {
            "id": "2029",
            "faqID": "1",
            "originID": "28",
            "destinationID": "30",
            "conditions": "[{\"interaction\":\"28_51\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2030",
            "faqID": "1",
            "originID": "27",
            "destinationID": "26",
            "conditions": "[{\"interaction\":\"27_58\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2031",
            "faqID": "1",
            "originID": "27",
            "destinationID": "35",
            "conditions": "[{\"interaction\":\"27_59\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2032",
            "faqID": "1",
            "originID": "29",
            "destinationID": "26",
            "conditions": "[{\"interaction\":\"29_56\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2033",
            "faqID": "1",
            "originID": "29",
            "destinationID": "35",
            "conditions": "[{\"interaction\":\"29_57\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2034",
            "faqID": "1",
            "originID": "28",
            "destinationID": "37",
            "conditions": "[{\"interaction\":\"28_52\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2035",
            "faqID": "1",
            "originID": "38",
            "destinationID": "2",
            "conditions": "[{\"interaction\":\"38_60\",\"action\":\"clicked\"},{\"interaction\":\"38_61\",\"action\":\"clicked\"},{\"interaction\":\"38_62\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2036",
            "faqID": "1",
            "originID": "38",
            "destinationID": "33",
            "conditions": "[{\"interaction\":\"38_63\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2037",
            "faqID": "1",
            "originID": "33",
            "destinationID": "38",
            "conditions": "[{\"interaction\":\"33_55\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2038",
            "faqID": "1",
            "originID": "1",
            "destinationID": "38",
            "conditions": "[{\"interaction\":\"1_1\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2039",
            "faqID": "1",
            "originID": "1",
            "destinationID": "39",
            "conditions": "[{\"interaction\":\"1_3\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2040",
            "faqID": "1",
            "originID": "39",
            "destinationID": "38",
            "conditions": "[{\"interaction\":\"39_64\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2041",
            "faqID": "1",
            "originID": "39",
            "destinationID": "40",
            "conditions": "[{\"interaction\":\"39_65\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2042",
            "faqID": "1",
            "originID": "1",
            "destinationID": "41",
            "conditions": "[{\"interaction\":\"1_2\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }, {
            "id": "2043",
            "faqID": "1",
            "originID": "41",
            "destinationID": "42",
            "conditions": "[{\"interaction\":\"41_66\",\"action\":\"clicked\"}]",
            "operator": "OR"
        }]
    }],
    "resetDelay": "5",
    "calledStep": "0"
};