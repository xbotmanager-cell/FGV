import fetch from 'node-fetch';

async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/commands');
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Commands count:', data.length);
        if (data.length > 0) {
            console.log('First command:', data[0].currentName);
        }
    } catch(e) {
        console.error('Error fetching:', e.message);
    }
}
testApi();
