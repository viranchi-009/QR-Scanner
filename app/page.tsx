"use client";

import { Scanner, useDevices, boundingBox } from "@yudiel/react-qr-scanner";
//import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IProps {
  disabled?: boolean;
  triggerComp?: React.ReactNode;
  onScanComplete?: (result: string) => void | Promise<void>;
}

function QRCodeScanner({ triggerComp, onScanComplete, disabled }: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [scannedData, setscannedData] = useState<string>("");
  const devices = useDevices();

  function handleModalToggle(newVal: boolean): void {
    setIsOpen(newVal);
  }

  async function handleScan(results: { rawValue: string }[]) {
    try {
      setIsProcessing(true);
      if (!results || !Array.isArray(results) || results.length === 0) return;
      const newValue = results[0].rawValue;
      setscannedData(newValue);
      if (onScanComplete) await onScanComplete(newValue);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
    // router.push(`/qrcode/${results[0].rawValue}`);
  }

  return (
    <div className="flex items-center justify-center w-full h-full py-60">
      <Dialog open={isOpen} onOpenChange={handleModalToggle}>
        <DialogTrigger disabled={disabled} asChild>
          {triggerComp ? (
            triggerComp
          ) : (
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Start QR Scanner
            </button>
          )}
        </DialogTrigger>
        <DialogContent className="h-[60vh] w-[85vw] lg:h-[80vh] rounded-lg p-4 flex flex-col items-center text-center">
          <DialogHeader className="w-full">
            <DialogTitle className="text-[0.9rem] 2xl:text-[1rem] mt-2 font-medium text-center w-full">
              Scan QR
            </DialogTitle>
          </DialogHeader>
          <div className="">
            <select
              className="p-2 border rounded-md"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            >
              <option value="">Default Camera</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full max-w-md space-y-3 md:my-4">
            {isOpen && (
              <Scanner
                onScan={handleScan}
                constraints={{
                  deviceId: deviceId,
                }}
                //allowMultiple
                formats={["qr_code", "linear_codes"]}
                components={{
                  // onOff: true,
                  finder: true,
                  zoom: true,
                  tracker: boundingBox,
                  torch: true,
                }}
                paused={isProcessing}
              />
            )}

            <div className="mt-6 p-4 bg-white rounded-md shadow">
              <h2 className="text-lg font-medium mb-2">Scanned Results</h2>
              <ul className="text-left text-sm space-y-1">{scannedData}</ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => handleModalToggle(false)}
              className="w-[24vw] md:w-[16vw]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default QRCodeScanner;
