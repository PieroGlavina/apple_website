import React from 'react'
import {footerLinks} from "../costants/index.js";

export const Footer = () => {
    return (
        <footer className="py-5 sm:px-10 px-5">
            <div className="screen-max-width">
                <div>
                    <p className="font-semibold text-gray">
                        More ways to shop: {" "}
                        <span className="underline text-blue">
                            {" "} Find an Apple Store {" "}
                        </span>
                        Or
                        <span className="underline text-blue">
                            {" "} other retailer {" "}
                        </span>
                        near you
                    </p>

                    <p className="font-semibold text-gray">
                        Or call 123456789
                    </p>
                </div>

                <div className="bg-neutral-700 my-5 h-[1px] w-full"/>
                <div className="flex md:flex-row flex-col md:items-center justify-between">
                    <p className="font-semibold text-gray">Copyright 2025 Apple INC. All Rights reserved</p>

                    <div className="flex">
                        {footerLinks.map((link) => (
                            <p key={link} className="font-semibold text-gray">{link}{" | "}</p>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
