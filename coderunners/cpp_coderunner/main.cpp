#include <iostream>
#include <vector>
#include <limits.h>
using namespace std;

int findMaxElement(const vector<int>& nums) {
    int maxElement = INT_MIN;
    for (int num : nums) {
        if (num > maxElement) {
            maxElement = num;
        }
    }
    return maxElement;
}

int main() {
    int t;
    cin >> t;
    cin.ignore(); // Ignore the newline after reading `t`
    while (t--) {
        int n;
        cin >> n;
        vector<int> nums(n);
        for (auto& i : nums) cin >> i;
        int maxElement = findMaxElement(nums);
        cout << maxElement << endl;
    }
    return 0;
}
