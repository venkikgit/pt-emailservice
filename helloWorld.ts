/* eslint-disable no-console */
import axios from 'axios';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function promptInput(inputName) {
    return new Promise((resolve) => {
        rl.question(`Enter the ${inputName} to send a message: `, (item) => {
            resolve(item);
        });
    });
}
async function sendEmailWithQueue(email, subject, text) {
    try {
        const response = await axios.post(
            'http://localhost:4000/api/notifications/email/v1/queue-email',
            {
                to: email,
                subject: subject,
                text: text,
            },
        );

        console.log('Email queued successfully!');
        console.log('Job ID:' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Failed to queue email:', error.message);
    }
}

async function sendEmailWithBaiscFunctinality(email, subject, text) {
    try {
        const response = await axios.post(
            'http://localhost:4000/api/notifications/email/v1/send-email',
            {
                to: email,
                subject: subject,
                text: text,
            },
        );

        console.log('Email sent successfully!');
        console.log('Job ID:' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Failed to send email:', error.message);
    }
}
async function getEmailJobIdStatus(jobId) {
    try {
        const response = await axios.get(
            `http://localhost:4000/api/notifications/email/v1/email-status/${jobId}`,
        );

        console.log('Job Status fetched successfully!');
        console.log('Job ID:' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Failed to get email status', error.message);
    }
}

async function main() {
    while (true) {
        console.info('\n1. Send email with basic functionality');
        console.info('2. Send email with retry functionality');
        console.info('3. Check Job ID status for retry functionality');
        console.info('4. Exit');

        const choice = await new Promise((resolve) => {
            rl.question('Choose an option (1-4): ', resolve);
        });

        switch (choice) {
            case '1': {
                const email = await promptInput('email');
                const subject = await promptInput('subject');
                const text = await promptInput('text');
                console.log('entered email' + email);
                if (email && subject && text) {
                    await sendEmailWithBaiscFunctinality(email, subject, text);
                }
                break;
            }
            case '2': {
                const email = await promptInput('email');
                const subject = await promptInput('subject');
                const text = await promptInput('text');
                console.log('entered email' + email);
                if (email && subject && text) {
                    await sendEmailWithQueue(email, subject, text);
                }
                break;
            }
            case '3': {
                const jobId = await promptInput('JobId');
                if (jobId) {
                    await getEmailJobIdStatus(jobId);
                }
                break;
            }
            case '4':
                rl.close();
                return;
            default:
                console.log('Invalid option. Please try again.');
        }
    }
}

main();
