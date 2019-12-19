String inData = "";

void loop(){
    while (Serial.available() > 0) {
        char received = Serial.read();
        inData.concat(received);

        // Process message when new line character is received
        if (received == '\n') {
            // Message is ready in inDate
        }
    }
}
