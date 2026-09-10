import 'package:flutter_test/flutter_test.dart';
import 'package:verified_glam/utils/vg_constants.dart';

void main() {
  test('release-facing configuration uses the Cloudflare backend', () {
    expect(kVGUseCloudBackend, isTrue);
    expect(vgAccountDeletionUrl, startsWith('https://'));
    expect(vgAccountDeletionUrl, endsWith('/delete-account'));
  });
}
