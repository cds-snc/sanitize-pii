import { defaultPatterns } from '../patterns';

const testFullStringMatch = (regex: RegExp, text: string): boolean => {
  const anchoredRegex = new RegExp(`^${regex.source}$`, regex.flags);
  return anchoredRegex.test(text);
};

describe('Default Patterns', () => {
  describe('phone_number pattern', () => {
    const phonePattern = defaultPatterns.find(p => p.name === 'phone_number')!;

    it('should match valid North American phone numbers', () => {
      const validPhones = [
        '(555) 123-4567',
        '555-123-4567',
        '555.123.4567',
        '5551234567',
        '+1-555-123-4567',
        '+1 555 123 4567',
        '1-555-123-4567',
        '1-555_123_4567',
      ];

      validPhones.forEach(phone => {
        expect(testFullStringMatch(phonePattern.regex, phone)).toBe(true);
      });
    });

    it('should not match invalid phone numbers', () => {
      const invalidPhones = [
        '123-456-789',
        '555-123-45678',
        'abc-def-ghij',
        'FR01-1756211151235',
        '-1-555_123_4567',
        'asdf5551234567',
      ];

      invalidPhones.forEach(phone => {
        expect(phonePattern.regex.test(phone)).toBe(false);
        phonePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('postal_code pattern', () => {
    const postalPattern = defaultPatterns.find(p => p.name === 'postal_code')!;

    it('should match valid Canadian postal codes', () => {
      const validPostalCodes = [
        'K1A 0A6',
        'M5V 3A8',
        'K1A-0A6',
        'M5V3A8',
        'k1a 0a6',
        'H3Z2Y7',
        'k1a.0a6',
        'H3Z_2Y7',
      ];

      validPostalCodes.forEach(code => {
        expect(testFullStringMatch(postalPattern.regex, code)).toBe(true);
      });
    });

    it('should not match invalid postal codes', () => {
      const invalidPostalCodes = ['12345', 'K1A 0A', '1A1 A1A', 'AAA AAA'];

      invalidPostalCodes.forEach(code => {
        expect(postalPattern.regex.test(code)).toBe(false);
        postalPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('pri pattern', () => {
    const priPattern = defaultPatterns.find(p => p.name === 'pri')!;

    it('should match valid Personal Record Identifiers', () => {
      const validPRIs = [
        '012-345-678',
        '12-345-678',
        '012345678',
        '12345678',
        '123-456-789',
        '123 456 789',
        '123.456.789',
        '123_456_789',
      ];

      validPRIs.forEach(pri => {
        expect(testFullStringMatch(priPattern.regex, pri)).toBe(true);
      });
    });

    it('should not match invalid Personal Record Identifiers', () => {
      const invalidPRIs = [
        '1-345-678',
        '1234-345-678',
        '123-45-678',
        '123-3456-678',
        '123-345-67',
        '123-345-6789',
        'abc-def-ghi',
      ];

      invalidPRIs.forEach(pri => {
        expect(priPattern.regex.test(pri)).toBe(false);
        priPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('sin pattern', () => {
    const sinPattern = defaultPatterns.find(p => p.name === 'sin')!;

    it('should match 9-digit format with various separators (regex test)', () => {
      const validFormats = [
        '123-456-789',
        '123456789',
        '987-654-321',
        '111222333',
        '111 222 333',
        '123.456.789',
        '123_456_789',
      ];

      validFormats.forEach(sin => {
        expect(testFullStringMatch(sinPattern.regex, sin)).toBe(true);
      });
    });

    it('should not match invalid formats (regex test)', () => {
      const invalidFormats = [
        '12-456-789',
        '1234-456-789',
        '123-45-789',
        '123-4567-789',
        '123-456-78',
        '123-456-7890',
        'abc-def-ghi',
        '123-456',
      ];

      invalidFormats.forEach(sin => {
        expect(sinPattern.regex.test(sin)).toBe(false);
        sinPattern.regex.lastIndex = 0;
      });
    });

    it('should validate using Luhn algorithm (full validation test)', () => {
      const validSINs = [
        '130-692-916', // Valid SIN with Luhn
        '130692916', // Same without separators
        '123-456-782', // Valid SIN with Luhn
        '987 654 324', // Valid SIN with space separators
        '555.123.454', // Valid SIN with dot separators
        '111_222_337', // Valid SIN with underscore separators
      ];

      expect(sinPattern.validator).toBeDefined();
      validSINs.forEach(sin => {
        expect(sinPattern.validator!(sin)).toBe(true);
      });
    });

    it('should reject invalid SINs using Luhn algorithm (full validation test)', () => {
      const invalidSINs = [
        '123-456-789', // Invalid Luhn
        '987-654-321', // Invalid Luhn
        '111-222-333', // Invalid Luhn
        '046-454-286', // Starts with 0 (reserved)
        '812-345-678', // Starts with 8 (reserved)
      ];

      expect(sinPattern.validator).toBeDefined();
      invalidSINs.forEach(sin => {
        expect(sinPattern.validator!(sin)).toBe(false);
      });
    });
  });

  describe('address_en pattern', () => {
    const addressPattern = defaultPatterns.find(p => p.name === 'address_en')!;

    it('should match valid addresses', () => {
      const validAddresses = [
        '123 Main St',
        '456 Elm Avenue',
        '789 Maple Road',
        '101 Pine Boulevard',
        '202 Oak Drive',
        '45-303 Cedar Prv',
      ];

      validAddresses.forEach(address => {
        expect(testFullStringMatch(addressPattern.regex, address)).toBe(true);
      });
    });

    it('should not match invalid addresses', () => {
      const invalidAddresses = [
        'Main St',
        '12345',
        'Elm Avenue 456',
        'Boulevard 789',
      ];

      invalidAddresses.forEach(address => {
        expect(addressPattern.regex.test(address)).toBe(false);
        addressPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('address_fr pattern', () => {
    const addressPattern = defaultPatterns.find(p => p.name === 'address_fr')!;

    it('should match valid French addresses', () => {
      const validAddresses = [
        '123 Rue de la Paix',
        '456 Avenue des Champs-Élysées',
        '789 Boulevard Saint-Germain',
        '101 Chemin du Moulin',
        '202 Allée des Fleurs',
        "4520-303 Impasse d'Orléans",
      ];

      validAddresses.forEach(address => {
        expect(testFullStringMatch(addressPattern.regex, address)).toBe(true);
      });
    });

    it('should not match invalid French addresses', () => {
      const invalidAddresses = [
        'Rue de la Paix 123',
        '456 Avenue',
        'Boulevard Saint-Germain 789',
        'Chemin du Moulin',
      ];

      invalidAddresses.forEach(address => {
        expect(addressPattern.regex.test(address)).toBe(false);
        addressPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('passport pattern', () => {
    const passportPattern = defaultPatterns.find(
      p => p.name === 'passport_canada'
    )!;

    it('should match valid Canadian passport numbers', () => {
      const validPassports = [
        'AB123456',
        'CD 123456',
        'EF-123456',
        'GH123456',
        'EF.123456',
        'EF_123456',
      ];

      validPassports.forEach(passport => {
        expect(testFullStringMatch(passportPattern.regex, passport)).toBe(true);
      });
    });

    it('should not match invalid passport numbers', () => {
      const invalidPassports = [
        'A123456',
        'AB12345',
        'AB1234567',
        'AB-1234-56',
        '12345678',
      ];

      invalidPassports.forEach(passport => {
        expect(passportPattern.regex.test(passport)).toBe(false);
        passportPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('ip_address pattern', () => {
    const ipPattern = defaultPatterns.find(p => p.name === 'ip_address')!;

    it('should match valid IP addresses', () => {
      const validIPs = [
        '192.168.1.1',
        '255.255.255.255',
        '10.0.0.1',
        '172.16.0.1',
      ];

      validIPs.forEach(ip => {
        expect(testFullStringMatch(ipPattern.regex, ip)).toBe(true);
      });
    });

    it('should not match invalid IP addresses', () => {
      const invalidIPs = ['192.168.1', 'abc.def.ghi.jkl'];

      invalidIPs.forEach(ip => {
        expect(ipPattern.regex.test(ip)).toBe(false);
        ipPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('drivers_license_alberta pattern', () => {
    const albertaLicensePattern = defaultPatterns.find(
      p => p.name === 'drivers_license_alberta'
    )!;

    it('should match valid Alberta drivers licenses', () => {
      const validLicenses = [
        '123456-789',
        '123456 789',
        '123456.789',
        '123456_789',
        '987654-321',
        '000000-000',
      ];

      validLicenses.forEach(license => {
        expect(testFullStringMatch(albertaLicensePattern.regex, license)).toBe(
          true
        );
      });
    });

    it('should not match invalid Alberta drivers licenses', () => {
      const invalidLicenses = [
        '12345-789',
        '1234567-789',
        '123456-78',
        '123456-7890',
        'abc456-789',
        '123456789',
      ];

      invalidLicenses.forEach(license => {
        expect(albertaLicensePattern.regex.test(license)).toBe(false);
        albertaLicensePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('drivers_license_manitoba pattern', () => {
    const manitobaLicensePattern = defaultPatterns.find(
      p => p.name === 'drivers_license_manitoba'
    )!;

    it('should match valid Manitoba drivers licenses', () => {
      const validLicenses = [
        'AB-CD-EF-G123HI',
        'AB CD EF G123HI',
        'AB.CD.EF.G123HI',
        'AB_CD_EF_G123HI',
      ];

      validLicenses.forEach(license => {
        expect(testFullStringMatch(manitobaLicensePattern.regex, license)).toBe(
          true
        );
      });
    });

    it('should not match invalid Manitoba drivers licenses', () => {
      const invalidLicenses = [
        'A-CD-EF-G123HI',
        'AB-C-EF-G123HI',
        'AB-CD-E-G123HI',
        'AB-CD-EF-GH123HI',
        'AB-CD-EF-G12HI',
        'AB-CD-EF-G1234HI',
        'AB-CD-EF-G123H',
        'AB-CD-EF-G123HIJ',
        '12-34-56-789012',
      ];

      invalidLicenses.forEach(license => {
        expect(manitobaLicensePattern.regex.test(license)).toBe(false);
        manitobaLicensePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('drivers_license_newfoundland pattern', () => {
    const newfoundlandLicensePattern = defaultPatterns.find(
      p => p.name === 'drivers_license_newfoundland'
    )!;

    it('should match valid Newfoundland drivers licenses', () => {
      const validLicenses = [
        'A123456789',
        'B987654321',
        'C000000000',
        'Z999999999',
      ];

      validLicenses.forEach(license => {
        expect(
          testFullStringMatch(newfoundlandLicensePattern.regex, license)
        ).toBe(true);
      });
    });

    it('should not match invalid Newfoundland drivers licenses', () => {
      const invalidLicenses = [
        '1123456789',
        'A12345678',
        'A1234567890',
        'AB123456789',
      ];

      invalidLicenses.forEach(license => {
        expect(newfoundlandLicensePattern.regex.test(license)).toBe(false);
        newfoundlandLicensePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('drivers_license_nova_scotia pattern', () => {
    const novascotiaLicensePattern = defaultPatterns.find(
      p => p.name === 'drivers_license_nova_scotia'
    )!;

    it('should match valid Nova Scotia drivers licenses', () => {
      const validLicenses = [
        'A-123456789',
        'AB-123456789',
        'ABC-123456789',
        'ABCD-123456789',
        'ABCDE-123456789',
        'A123456789',
        'AB123456789',
        'A.123456789',
        'A_123456789',
        'A123456789',
      ];

      validLicenses.forEach(license => {
        expect(
          testFullStringMatch(novascotiaLicensePattern.regex, license)
        ).toBe(true);
      });
    });

    it('should not match invalid Nova Scotia drivers licenses', () => {
      const invalidLicenses = [
        'ABCDEF-123456789',
        'A-12345678',
        'A-1234567890',
        '1-123456789',
        'A-12345678a',
      ];

      invalidLicenses.forEach(license => {
        expect(novascotiaLicensePattern.regex.test(license)).toBe(false);
        novascotiaLicensePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('drivers_license_ontario pattern', () => {
    const ontarioLicensePattern = defaultPatterns.find(
      p => p.name === 'drivers_license_ontario'
    )!;

    it('should match valid Ontario drivers licenses', () => {
      const validLicenses = [
        'A1234-56789-01234',
        'A1234.56789.01234',
        'B56781234567890',
        'A1234 56789 01234',
        'A1234_56789_01234',
      ];

      validLicenses.forEach(license => {
        expect(testFullStringMatch(ontarioLicensePattern.regex, license)).toBe(
          true
        );
      });
    });

    it('should not match invalid Ontario drivers licenses', () => {
      const invalidLicenses = [
        'A123-45678-90123',
        '1234-56789-01234',
        'A123456789012',
      ];

      invalidLicenses.forEach(license => {
        expect(ontarioLicensePattern.regex.test(license)).toBe(false);
        ontarioLicensePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('drivers_license_quebec pattern', () => {
    const quebecLicensePattern = defaultPatterns.find(
      p => p.name === 'drivers_license_quebec'
    )!;

    it('should match valid Quebec drivers licenses', () => {
      const validLicenses = [
        'A1234-567890-01',
        'B567812345602',
        'A1234 567890 01',
        'A1234.567890.01',
        'A1234_567890_01',
      ];

      validLicenses.forEach(license => {
        expect(testFullStringMatch(quebecLicensePattern.regex, license)).toBe(
          true
        );
      });
    });

    it('should not match invalid Quebec drivers licenses', () => {
      const invalidLicenses = [
        'A123-45678-901',
        '1234-56789-012',
        'A12345678901',
      ];

      invalidLicenses.forEach(license => {
        expect(quebecLicensePattern.regex.test(license)).toBe(false);
        quebecLicensePattern.regex.lastIndex = 0;
      });
    });
  });

  describe('health_card_alberta pattern', () => {
    const albertaHealthCardPattern = defaultPatterns.find(
      p => p.name === 'health_card_alberta'
    )!;

    it('should match valid Alberta health cards', () => {
      const validCards = [
        '12345-6789',
        '12345 6789',
        '12345.6789',
        '12345_6789',
        '98765-4321',
        '00000-0000',
      ];

      validCards.forEach(card => {
        expect(testFullStringMatch(albertaHealthCardPattern.regex, card)).toBe(
          true
        );
      });
    });

    it('should not match invalid Alberta health cards', () => {
      const invalidCards = [
        '1234-6789',
        '123456-6789',
        '12345-678',
        '12345-67890',
        'abcde-6789',
        '123456789',
      ];

      invalidCards.forEach(card => {
        expect(albertaHealthCardPattern.regex.test(card)).toBe(false);
        albertaHealthCardPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('health_card_newfoundland pattern', () => {
    const newfoundlandHealthCardPattern = defaultPatterns.find(
      p => p.name === 'health_card_newfoundland'
    )!;

    it('should match valid Newfoundland health cards', () => {
      const validCards = [
        '123-456-789-012',
        '123 456 789 012',
        '123.456.789.012',
        '123_456_789_012',
        '987-654-321-098',
        '000-000-000-000',
      ];

      validCards.forEach(card => {
        expect(
          testFullStringMatch(newfoundlandHealthCardPattern.regex, card)
        ).toBe(true);
      });
    });

    it('should not match invalid Newfoundland health cards', () => {
      const invalidCards = [
        '12-456-789-012',
        '1234-456-789-012',
        '123-45-789-012',
        '123-4567-789-012',
        '123-456-78-012',
        '123-456-7890-012',
        '123-456-789-01',
        '123-456-789-0123',
        'abc-def-ghi-jkl',
      ];

      invalidCards.forEach(card => {
        expect(newfoundlandHealthCardPattern.regex.test(card)).toBe(false);
        newfoundlandHealthCardPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('health_card_nova_scotia pattern', () => {
    const novascotiaHealthCardPattern = defaultPatterns.find(
      p => p.name === 'health_card_nova_scotia'
    )!;

    it('should match valid Nova Scotia health cards', () => {
      const validCards = [
        '1234-567-890',
        '1234 567 890',
        '1234.567.890',
        '1234_567_890',
        '9876-543-210',
        '0000-000-000',
      ];

      validCards.forEach(card => {
        expect(
          testFullStringMatch(novascotiaHealthCardPattern.regex, card)
        ).toBe(true);
      });
    });

    it('should not match invalid Nova Scotia health cards', () => {
      const invalidCards = [
        '123-567-890',
        '12345-567-890',
        '1234-56-890',
        '1234-5678-890',
        '1234-567-89',
        '1234-567-8901',
        'abcd-efg-hij',
      ];

      invalidCards.forEach(card => {
        expect(novascotiaHealthCardPattern.regex.test(card)).toBe(false);
        novascotiaHealthCardPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('health_card_nwt pattern', () => {
    const nwtHealthCardPattern = defaultPatterns.find(
      p => p.name === 'health_card_nwt'
    )!;

    it('should match valid Northwest Territories health cards', () => {
      const validCards = ['A1234567', 'B9876543', 'C0000000', 'Z9999999'];

      validCards.forEach(card => {
        expect(testFullStringMatch(nwtHealthCardPattern.regex, card)).toBe(
          true
        );
      });
    });

    it('should not match invalid Northwest Territories health cards', () => {
      const invalidCards = [
        '1A1234567',
        'A123456',
        'A12345678',
        'AB1234567',
        'A123456A',
      ];

      invalidCards.forEach(card => {
        expect(nwtHealthCardPattern.regex.test(card)).toBe(false);
        nwtHealthCardPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('health_card_ontario pattern', () => {
    const ontarioHealthCardPattern = defaultPatterns.find(
      p => p.name === 'health_card_ontario'
    )!;

    it('should match valid Ontario health cards', () => {
      const validCards = ['1234-567-890-AB', '1234 567 890 B', '1234567890C'];

      validCards.forEach(card => {
        expect(testFullStringMatch(ontarioHealthCardPattern.regex, card)).toBe(
          true
        );
      });
    });

    it('should not match invalid Ontario health cards', () => {
      const invalidCards = ['123-456-789-A', '1234-5678-90-B', '1234567890ADD'];

      invalidCards.forEach(card => {
        expect(ontarioHealthCardPattern.regex.test(card)).toBe(false);
        ontarioHealthCardPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('health_card_quebec pattern', () => {
    const quebecHealthCardPattern = defaultPatterns.find(
      p => p.name === 'health_card_quebec'
    )!;

    it('should match valid Quebec health cards', () => {
      const validCards = ['ABCD-1234-5678', 'EFGH 1234 5678', 'IJKL12345678'];

      validCards.forEach(card => {
        expect(testFullStringMatch(quebecHealthCardPattern.regex, card)).toBe(
          true
        );
      });
    });

    it('should not match invalid Quebec health cards', () => {
      const invalidCards = [
        'ABCD-12345-678',
        'EFGH 12345 678',
        'IJKL123456789',
      ];

      invalidCards.forEach(card => {
        expect(quebecHealthCardPattern.regex.test(card)).toBe(false);
        quebecHealthCardPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('credit_card pattern', () => {
    const creditCardPattern = defaultPatterns.find(
      p => p.name === 'credit_card'
    )!;

    it('should match valid credit card numbers', () => {
      const validCards = [
        '1234-5678-9012-3456',
        '1234 5678 9012 3456',
        '1234567890123456',
        '1234-5678-9012-345',
      ];
      validCards.forEach(card => {
        expect(testFullStringMatch(creditCardPattern.regex, card)).toBe(true);
      });
    });

    it('should not match invalid credit card numbers', () => {
      const invalidCards = [
        '1234-5678-9012-34567',
        '1234 5678 9012 34567',
        'asdfghjklqwerty',
        '1234-5678-9012-34',
      ];
      invalidCards.forEach(card => {
        expect(creditCardPattern.regex.test(card)).toBe(false);
        creditCardPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('7+_digit_number pattern', () => {
    const sevenDigitPattern = defaultPatterns.find(
      p => p.name === '7+_digit_number'
    )!;

    it('should match numbers with 7 or more digits', () => {
      const validNumbers = [
        '1234567',
        '12345678',
        '1234567890',
        '9876543210',
        '1234567890123',
      ];

      validNumbers.forEach(num => {
        expect(testFullStringMatch(sevenDigitPattern.regex, num)).toBe(true);
      });
    });

    it('should not match numbers with less than 7 digits', () => {
      const invalidNumbers = ['123456', '12345', '1234', '123'];

      invalidNumbers.forEach(num => {
        expect(sevenDigitPattern.regex.test(num)).toBe(false);
        sevenDigitPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('api_key_gc_notify pattern', () => {
    const apiKeyPattern = defaultPatterns.find(
      p => p.name === 'api_key_gc_notify'
    )!;

    it('should match valid GC Notify API keys', () => {
      const validKeys = [
        'gcntfy-test-e2253c4f-b642-4ef5-a104-f3d823bb2158',
        'gcntfy-test_underscores_pattern-e2253c4f-b642-4ef5-a104-f3d823bb2158',
        'gcntfy-another-name-9e8cada6-6f29-4afb-866c-3d696b60735e',
        'gcntfy-some-key-name-ae6dd110-78b4-49a0-94b8-748121735882',
      ];
      validKeys.forEach(key => {
        expect(testFullStringMatch(apiKeyPattern.regex, key)).toBe(true);
      });
    });

    it('should not match invalid GC Notify API keys', () => {
      const invalidKeys = [
        'muffins-gcnotify',
        'gcntfy-abcdefg',
        'gcntfy-1234-5678-90ab-cdefg',
        'gcntfy-nogap9e8cada6-6f29-4afb-866c-3d696b60735e',
        'notgcntfy-e2253c4f-b642-4ef5-a104-f3d823bb2158',
      ];
      invalidKeys.forEach(key => {
        expect(apiKeyPattern.regex.test(key)).toBe(false);
        apiKeyPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('po_box pattern', () => {
    const poBoxPattern = defaultPatterns.find(p => p.name === 'po_box')!;

    it('should match valid PO Box addresses', () => {
      const validPOBoxes = [
        'P.O. BOX 123',
        'P.O.BOX 456',
        'P O BOX 789',
        'P.O. BOX 202',
        'PO-BOX 303',
      ];

      validPOBoxes.forEach(box => {
        expect(testFullStringMatch(poBoxPattern.regex, box)).toBe(true);
      });
    });

    it('should not match invalid PO Box addresses', () => {
      const invalidPOBoxes = ['BOX 123', 'P.O. 456', 'P BOX 789', 'P.O.BOX'];

      invalidPOBoxes.forEach(box => {
        expect(poBoxPattern.regex.test(box)).toBe(false);
        poBoxPattern.regex.lastIndex = 0;
      });
    });
  });

  describe('bank_account_canada pattern', () => {
    const bankAccountPattern = defaultPatterns.find(
      p => p.name === 'bank_account_canada'
    )!;

    it('should match valid Canadian bank account numbers', () => {
      const validAccounts = [
        '12345-678-9012345',
        '12345 678 90123456',
        '12345.678.901234567',
        '12345_678_9012345678',
        '12345-678-901234567890',
      ];
      validAccounts.forEach(account => {
        expect(testFullStringMatch(bankAccountPattern.regex, account)).toBe(
          true
        );
      });
    });

    it('should not match invalid Canadian bank account numbers', () => {
      const invalidAccounts = [
        '1234-567-89012345678',
        '12345678901234567890',
        '12345-678-9012345678901',
      ];
      invalidAccounts.forEach(account => {
        expect(bankAccountPattern.regex.test(account)).toBe(false);
        bankAccountPattern.regex.lastIndex = 0;
      });
    });
  });

  it('should have all required properties', () => {
    defaultPatterns.forEach(pattern => {
      expect(pattern.name).toBeDefined();
      expect(typeof pattern.name).toBe('string');
      expect(pattern.regex).toBeInstanceOf(RegExp);
      expect(pattern.regex.global).toBe(true); // Should be global for replacement
    });
  });

  it('should have unique pattern names', () => {
    const names = defaultPatterns.map(p => p.name);
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });
});
