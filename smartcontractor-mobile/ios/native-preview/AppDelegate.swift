import UIKit

// Preview only.
// This file shows the kind of native hooks SmartContractor may need later.
// It is not connected to a generated Capacitor Xcode project yet.
final class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        return true
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        // Future use:
        // - wallet handoff callbacks
        // - WebAuth return links
        // - SmartContractor project/job deep links
        return SmartContractorDeepLinkPreview.handle(url)
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
              let url = userActivity.webpageURL else {
            return false
        }

        // Future use:
        // - universal links for job details
        // - homeowner project links
        // - contractor invite links
        return SmartContractorDeepLinkPreview.handle(url)
    }
}

enum SmartContractorDeepLinkPreview {
    static func handle(_ url: URL) -> Bool {
        let supportedHosts = [
            "smartcontractor.gcsc.example",
            "gcsc.example"
        ]

        if let host = url.host, supportedHosts.contains(host) {
            return true
        }

        if url.scheme == "smartcontractor" {
            return true
        }

        return false
    }
}

