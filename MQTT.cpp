#include "pxt.h"
using namespace pxt;
namespace Emmqtt {

    //%
    void emmqttSetTxBufferSize(int size){
        // if(size > 100) {
        //     size = 100;
        // }
        uBit.serial.setTxBufferSize(size);
    }

    //%
    void emmqttSetRxBufferSize(int size){
        // if(size > 100) {
        //     size = 100;
        // }
        uBit.serial.setRxBufferSize(size);
    }

    //%
    void emmqttEventOn(){
        uBit.serial.eventOn(ManagedString('\r'), MicroBitSerialMode::ASYNC);
    }

    //%
    void emmqttClearRxBuffer(){
        uBit.serial.clearRxBuffer();
    }

    //%
    void emmqttClearTxBuffer(){
        uBit.serial.clearTxBuffer();
    }

    //%    
    void forever_stubs(void *a) {
        runAction0((Action)a);
    }

    //%
    void emmqttforevers(Action a) {
      if (a != 0) {
        incr(a);
        create_fiber(forever_stubs, (void*)a);
      }
    }

    //%
    void emmqttWriteString(StringData *text) {
      if (!text) {
          return;
      }
      uBit.serial.send(ManagedString(text));
    }
}
